// src/main.ts
import { NestFactory } from '@nestjs/core';
import {ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';
import * as session from 'express-session';
import flash = require('connect-flash');
import * as exphbs from 'express-handlebars';
import * as passport from 'passport';
import * as hbs from 'hbs';
import * as cookieParser from 'cookie-parser';
import * as bodyParser from 'body-parser';
import { urlencoded, json } from 'express';
// // import hbs = require('hbs');


async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
    // new FastifyAdapter(),
  );
  const viewsPath = join(__dirname, '../public/views');
  app.useStaticAssets(viewsPath);
  // console.log('viewsPath =>',viewsPath)
  app.engine('.hbs', exphbs({ 
    extname: '.hbs', defaultLayout: 'main', 
    helpers: {
      ifEquals: function (a, b, options) {
        if (a === b) {
          return options.fn(this);
        }    
        return options.inverse(this);
       },
       ifMod: function (a, b, options) {
        if(a > 1){
          if (((a+1) %b) === 0) {
            return options.fn(this);
          }
        }
        return options.inverse(this);
       },     
       math: function(lvalue, operator, rvalue) {
        lvalue = parseFloat(lvalue);
        rvalue = parseFloat(rvalue);
        return {
            "+": lvalue + rvalue,
            "-": lvalue - rvalue,
            "*": lvalue * rvalue,
            "/": lvalue / rvalue,
            "%": lvalue % rvalue
        }[operator];
      },
      numberFormat: function(lvalue) {
        var formatter = new Intl.NumberFormat('id-ID', {
          // style: 'currency',
          // currency: 'IDR',
          minimumFractionDigits: 0
        
          // These options are needed to round to whole numbers if that's what you want.
          //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
          //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
        });
        lvalue = parseFloat(lvalue);
        return (formatter.format(lvalue))
      },
      json: function(content) {
        return JSON.stringify(content);
      }
    } 
  }));
  app.setGlobalPrefix(process.env.BASEPATH);
  app.set('views', viewsPath);
  app.set('view engine', '.hbs');
  hbs.registerPartials(join(__dirname, '..', 'views', 'partials'));
 
  app.use(
    session({
      secret: 'nest cats',
      resave: false,
      saveUninitialized: false,
    }),
  );
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(flash());
  app.useGlobalPipes(new ValidationPipe());
  app.use(cookieParser());

  app.use(bodyParser.json({ limit: '50mb' }));
  
  app.use(bodyParser.urlencoded({
    limit: '50mb',
    parameterLimit: 100000,
    extended: true 
  }));
  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true, limit: '50mb' }));
  
  app.enableCors();
  await app.listen(process.env.PORT);
}
bootstrap();