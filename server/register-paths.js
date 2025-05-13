const moduleAlias = require('module-alias');

moduleAlias.addAliases({
  '@app': __dirname + '/src',
  '@config': __dirname + '/src/config',
  '@model': __dirname + '/src/models',
  '@util': __dirname + '/src/utils',
  '@repository': __dirname + '/src/repositories',
  '@services': __dirname + '/src/services',
  '@decorators': __dirname + '/src/decorator',
  '@controller': __dirname + '/src/controllers',
  '@routes': __dirname + '/src/routes',
  '@plugins': __dirname + '/src/plugins',
  'generated/prisma': __dirname + '/generated/prisma'
});