
Object.defineProperty(exports, "__esModule", { value: true });

const {
  Decimal,
  objectEnumValues,
  makeStrictEnum,
  Public,
  getRuntime,
  skip
} = require('./runtime/index-browser.js')


const Prisma = {}

exports.Prisma = Prisma
exports.$Enums = {}

/**
 * Prisma Client JS version: 6.6.0
 * Query Engine version: f676762280b54cd07c770017ed3711ddde35f37a
 */
Prisma.prismaVersion = {
  client: "6.6.0",
  engine: "f676762280b54cd07c770017ed3711ddde35f37a"
}

Prisma.PrismaClientKnownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientKnownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)};
Prisma.PrismaClientUnknownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientUnknownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientRustPanicError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientRustPanicError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientInitializationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientInitializationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientValidationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientValidationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`sqltag is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.empty = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`empty is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.join = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`join is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.raw = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`raw is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.validator = Public.validator

/**
* Extensions
*/
Prisma.getExtensionContext = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.getExtensionContext is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.defineExtension = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.defineExtension is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}

/**
 * Shorthand utilities for JSON filtering
 */
Prisma.DbNull = objectEnumValues.instances.DbNull
Prisma.JsonNull = objectEnumValues.instances.JsonNull
Prisma.AnyNull = objectEnumValues.instances.AnyNull

Prisma.NullTypes = {
  DbNull: objectEnumValues.classes.DbNull,
  JsonNull: objectEnumValues.classes.JsonNull,
  AnyNull: objectEnumValues.classes.AnyNull
}



/**
 * Enums
 */

exports.Prisma.TransactionIsolationLevel = makeStrictEnum({
  ReadUncommitted: 'ReadUncommitted',
  ReadCommitted: 'ReadCommitted',
  RepeatableRead: 'RepeatableRead',
  Serializable: 'Serializable'
});

exports.Prisma.CategoryScalarFieldEnum = {
  id: 'id',
  name: 'name',
  description: 'description',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  deletedAt: 'deletedAt'
};

exports.Prisma.BrandScalarFieldEnum = {
  id: 'id',
  name: 'name',
  originCountry: 'originCountry',
  description: 'description',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  deletedAt: 'deletedAt'
};

exports.Prisma.ProductScalarFieldEnum = {
  id: 'id',
  name: 'name',
  code: 'code',
  shortDescription: 'shortDescription',
  longDescription: 'longDescription',
  price: 'price',
  quantity: 'quantity',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  deletedAt: 'deletedAt',
  categoryId: 'categoryId',
  brandId: 'brandId'
};

exports.Prisma.AttributesScalarFieldEnum = {
  id: 'id',
  attributeKey: 'attributeKey',
  attributeValue: 'attributeValue',
  productId: 'productId'
};

exports.Prisma.ProductMediaScalarFieldEnum = {
  id: 'id',
  productId: 'productId',
  mediaId: 'mediaId'
};

exports.Prisma.MediaScalarFieldEnum = {
  id: 'id',
  url: 'url',
  description: 'description',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  userId: 'userId'
};

exports.Prisma.CartScalarFieldEnum = {
  id: 'id',
  quantity: 'quantity',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  deletedAt: 'deletedAt',
  userId: 'userId',
  productId: 'productId'
};

exports.Prisma.ReviewScalarFieldEnum = {
  id: 'id',
  rating: 'rating',
  comment: 'comment',
  productId: 'productId',
  userId: 'userId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.UserScalarFieldEnum = {
  id: 'id',
  fullName: 'fullName',
  email: 'email',
  phoneNumber: 'phoneNumber',
  passwordHash: 'passwordHash',
  address: 'address',
  isAdmin: 'isAdmin',
  isVerifiedEmail: 'isVerifiedEmail',
  forgotToken: 'forgotToken',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  deletedAt: 'deletedAt',
  mediaId: 'mediaId'
};

exports.Prisma.TokenScalarFieldEnum = {
  id: 'id',
  refreshToken: 'refreshToken',
  expiresAt: 'expiresAt',
  ipAddress: 'ipAddress',
  userId: 'userId'
};

exports.Prisma.ConversationScalarFieldEnum = {
  id: 'id',
  role: 'role',
  content: 'content',
  userId: 'userId',
  createdAt: 'createdAt'
};

exports.Prisma.OrderScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  phoneNumber: 'phoneNumber',
  note: 'note',
  totalAmount: 'totalAmount',
  orderDate: 'orderDate',
  orderStatus: 'orderStatus',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.OrderDetailScalarFieldEnum = {
  id: 'id',
  orderId: 'orderId',
  productId: 'productId',
  productName: 'productName',
  quantity: 'quantity',
  unitPrice: 'unitPrice',
  subtotal: 'subtotal',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.PaymentScalarFieldEnum = {
  id: 'id',
  orderId: 'orderId',
  stripeChargeId: 'stripeChargeId',
  amount: 'amount',
  currency: 'currency',
  paymentMethod: 'paymentMethod',
  paymentIntentId: 'paymentIntentId',
  status: 'status',
  metadata: 'metadata',
  errorMessage: 'errorMessage',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.SortOrder = {
  asc: 'asc',
  desc: 'desc'
};

exports.Prisma.JsonNullValueInput = {
  JsonNull: Prisma.JsonNull
};

exports.Prisma.NullableJsonNullValueInput = {
  DbNull: Prisma.DbNull,
  JsonNull: Prisma.JsonNull
};

exports.Prisma.QueryMode = {
  default: 'default',
  insensitive: 'insensitive'
};

exports.Prisma.NullsOrder = {
  first: 'first',
  last: 'last'
};

exports.Prisma.CategoryOrderByRelevanceFieldEnum = {
  id: 'id',
  name: 'name',
  description: 'description'
};

exports.Prisma.BrandOrderByRelevanceFieldEnum = {
  id: 'id',
  name: 'name',
  originCountry: 'originCountry',
  description: 'description'
};

exports.Prisma.ProductOrderByRelevanceFieldEnum = {
  id: 'id',
  name: 'name',
  code: 'code',
  shortDescription: 'shortDescription',
  longDescription: 'longDescription',
  categoryId: 'categoryId',
  brandId: 'brandId'
};

exports.Prisma.AttributesOrderByRelevanceFieldEnum = {
  id: 'id',
  attributeKey: 'attributeKey',
  attributeValue: 'attributeValue',
  productId: 'productId'
};

exports.Prisma.ProductMediaOrderByRelevanceFieldEnum = {
  id: 'id',
  productId: 'productId',
  mediaId: 'mediaId'
};

exports.Prisma.MediaOrderByRelevanceFieldEnum = {
  id: 'id',
  url: 'url',
  description: 'description',
  userId: 'userId'
};

exports.Prisma.CartOrderByRelevanceFieldEnum = {
  id: 'id',
  userId: 'userId',
  productId: 'productId'
};

exports.Prisma.ReviewOrderByRelevanceFieldEnum = {
  id: 'id',
  comment: 'comment',
  productId: 'productId',
  userId: 'userId'
};

exports.Prisma.UserOrderByRelevanceFieldEnum = {
  id: 'id',
  fullName: 'fullName',
  email: 'email',
  phoneNumber: 'phoneNumber',
  passwordHash: 'passwordHash',
  address: 'address',
  forgotToken: 'forgotToken',
  mediaId: 'mediaId'
};

exports.Prisma.TokenOrderByRelevanceFieldEnum = {
  refreshToken: 'refreshToken',
  ipAddress: 'ipAddress',
  userId: 'userId'
};

exports.Prisma.JsonNullValueFilter = {
  DbNull: Prisma.DbNull,
  JsonNull: Prisma.JsonNull,
  AnyNull: Prisma.AnyNull
};

exports.Prisma.ConversationOrderByRelevanceFieldEnum = {
  id: 'id',
  userId: 'userId'
};

exports.Prisma.OrderOrderByRelevanceFieldEnum = {
  id: 'id',
  userId: 'userId',
  phoneNumber: 'phoneNumber',
  note: 'note'
};

exports.Prisma.OrderDetailOrderByRelevanceFieldEnum = {
  id: 'id',
  orderId: 'orderId',
  productId: 'productId',
  productName: 'productName'
};

exports.Prisma.PaymentOrderByRelevanceFieldEnum = {
  id: 'id',
  orderId: 'orderId',
  stripeChargeId: 'stripeChargeId',
  currency: 'currency',
  paymentMethod: 'paymentMethod',
  paymentIntentId: 'paymentIntentId',
  status: 'status',
  errorMessage: 'errorMessage'
};
exports.RoleEnum = exports.$Enums.RoleEnum = {
  User: 'User',
  Assistant: 'Assistant'
};

exports.OrderStatusEnum = exports.$Enums.OrderStatusEnum = {
  PENDING: 'PENDING',
  PROCESSING: 'PROCESSING',
  COMPLETED: 'COMPLETED',
  CANCELED: 'CANCELED'
};

exports.Prisma.ModelName = {
  Category: 'Category',
  Brand: 'Brand',
  Product: 'Product',
  Attributes: 'Attributes',
  ProductMedia: 'ProductMedia',
  Media: 'Media',
  Cart: 'Cart',
  Review: 'Review',
  User: 'User',
  Token: 'Token',
  Conversation: 'Conversation',
  Order: 'Order',
  OrderDetail: 'OrderDetail',
  Payment: 'Payment'
};

/**
 * This is a stub Prisma Client that will error at runtime if called.
 */
class PrismaClient {
  constructor() {
    return new Proxy(this, {
      get(target, prop) {
        let message
        const runtime = getRuntime()
        if (runtime.isEdge) {
          message = `PrismaClient is not configured to run in ${runtime.prettyName}. In order to run Prisma Client on edge runtime, either:
- Use Prisma Accelerate: https://pris.ly/d/accelerate
- Use Driver Adapters: https://pris.ly/d/driver-adapters
`;
        } else {
          message = 'PrismaClient is unable to run in this browser environment, or has been bundled for the browser (running in `' + runtime.prettyName + '`).'
        }

        message += `
If this is unexpected, please open an issue: https://pris.ly/prisma-prisma-bug-report`

        throw new Error(message)
      }
    })
  }
}

exports.PrismaClient = PrismaClient

Object.assign(exports, Prisma)
