import { FastifyReply, FastifyRequest } from 'fastify';

import { emailTokenOption, ErrorCodes } from '@config';
import { binding } from '@decorators/binding.decorator';
import {
  EmailTokenPayloadType,
  ErrorResponseType,
  ForgotPasswordRequestType,
  LoginRequestType,
  LoginResponseType,
  RefreshTokenType,
  RegisterUserRequestType,
  SuccessResponseType,
  SuccessResWithoutDataType,
  TokenPayloadType,
  VerifyEmailTokenType,
} from '@model';
import AuthService from '@services/auth.service';
import MailService from '@services/mail.service';
import UserService from '@services/user.service';

export default class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly mailService: MailService
  ) {}

  @binding
  async register(
    request: FastifyRequest<{ Body: RegisterUserRequestType }>,
    reply: FastifyReply
  ): Promise<FastifyReply> {
    try {
      // Register user
      const result = await this.authService.register(request.body);

      if (!result.success) {
        const errorResponse: ErrorResponseType = {
          message: result.message,
          code: result.code,
        };
        return reply.BadRequest(errorResponse);
      }

      //Send mail
      const emailPayload: EmailTokenPayloadType = { userId: result.data.id };
      const verificationEmailToken = this.mailService.generateEmailToken(emailPayload, emailTokenOption);

      const emailSent = await this.mailService.sendVerificationEmail(result.data.email, verificationEmailToken);

      if (!emailSent) {
        const errorResponse: ErrorResponseType = {
          message: 'Could not send verification email',
          code: ErrorCodes.SENT_EMAIL_FAIL,
        };
        return reply.BadRequest(errorResponse);
      }

      // Response
      const res: SuccessResWithoutDataType = {
        code: 201,
        success: result.success,
      };

      return reply.Created(res);
    } catch (error) {
      return reply.InternalServer(error);
    }
  }

  @binding
  async verifyEmail(
    request: FastifyRequest<{ Body: VerifyEmailTokenType }>,
    reply: FastifyReply
  ): Promise<FastifyReply> {
    try {
      const result = await this.userService.verifyEmail(request.decodedEmailToken.userId);

      if (!result) {
        const errorResponse: ErrorResponseType = {
          message: 'Verify failed',
          code: ErrorCodes.INVALID_EMAIL_TOKEN,
        };
        return reply.BadRequest(errorResponse);
      }

      const res: SuccessResWithoutDataType = {
        code: 201,
        success: true,
      };
      return reply.OK(res);
    } catch (error) {
      return reply.InternalServer(error);
    }
  }

  @binding
  async login(request: FastifyRequest<{ Body: LoginRequestType }>, reply: FastifyReply): Promise<FastifyReply> {
    try {
      const ipAddress = request.ip;

      const result = await this.authService.login(request.body);

      if (!result.success) {
        const errorResponse: ErrorResponseType = {
          message: result.message,
          code: result.code,
        };
        return reply.BadRequest(errorResponse);
      }

      const payload: TokenPayloadType = {
        isAdmin: result.data.isAdmin,
        userId: result.data.id,
        userEmail: result.data.email,
      };

      const tokens: LoginResponseType = this.authService.generateTokens(payload);

      const refreshTokenData: RefreshTokenType = {
        refreshToken: tokens.refreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        ipAddress,
        userId: result.data.id,
      };

      await this.authService.saveRefreshToken(refreshTokenData);

      const res: SuccessResponseType<LoginResponseType> = {
        code: 200,
        data: tokens,
      };
      return reply.OK(res);
    } catch (error) {
      return reply.InternalServer(error);
    }
  }

  @binding
  async forgotPassword(
    request: FastifyRequest<{ Body: ForgotPasswordRequestType }>,
    reply: FastifyReply
  ): Promise<FastifyReply> {
    try {
      const result = await this.userService.getUserByEmail(request.body.email);

      if (!result.success) {
        const errorResponse: ErrorResponseType = {
          message: result.message,
          code: result.code,
        };
        return reply.NotFound(errorResponse);
      }

      const forgotToken = await this.userService.createForgotToken(result.data.id);
      const emailSent = await this.mailService.sendForgotPasswordEmail(result.data.email, forgotToken);

      if (!emailSent) {
        const errorResponse: ErrorResponseType = {
          message: 'Could not send forgot-password email',
          code: ErrorCodes.SENT_EMAIL_FAIL,
        };
        return reply.BadRequest(errorResponse);
      }

      const res: SuccessResWithoutDataType = {
        code: 200,
        success: true,
      };
      return reply.OK(res);
    } catch (error) {
      return reply.InternalServer(error);
    }
  }
}
