## Create & Use Custom Pipes

```bash
# create pipes
$ nest g pipe [name]

# create pipes with folder
$ nest g pipe common/pipes/uppercase
```

![folder img](/public/Img/folder.png)

```bash
# uppercase.pipe.ts
import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class UppercasePipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {

    if(typeof value === 'string') {
      return value.toUpperCase();
    }

    return value;
  }
}
```

```bash
# create controller
$ nest g controller myname
```

```bash
# myname.controller.ts
import { Body, Controller, Post } from '@nestjs/common';
import { UppercasePipe } from 'src/common/pipes/uppercase/uppercase.pipe';

@Controller('myname')
export class MynameController {
    @Post('custom')
    transformName(@Body('name', new UppercasePipe()) name: string){
        return { message: `Hello ${name}!` };
    }
}
```

##### Note: Headers e Content-Type application/json add korte hobe

![](/public/Img/header.png)
![](/public/Img/custom.png)

NestJS-এ Pipe হলো একটি middleware-এর মতো mechanism, যা controller method-এ যাওয়ার আগে data transform বা validate করে।

সহজভাবে বললে —
👉 Client → Request → Pipe → Controller → Service

মানে Controller-এ data যাওয়ার আগে Pipe data check / modify করতে পারে।

---

#### ১. Pipe কেন ব্যবহার করা হয়?

NestJS-এ Pipe সাধারণত ২টি কাজ করে:

#### 1️⃣ Validation

Client যে data পাঠাচ্ছে সেটা ঠিক আছে কিনা check করা।

উদাহরণ

- id number কিনা
- email valid কিনা
- field empty কিনা

#### 2️⃣ Transformation

Data type change করা।

উদাহরণ

?id=10

Query parameter সবসময় string আসে।

Pipe ব্যবহার করলে:

"10" → 10 (number)


#### ২. Pipe কোথায় কাজ করে?

Pipe সাধারণত এই জায়গায় ব্যবহার হয়।

- Body
- Query
- Param
- Custom DTO validation

Example

```ts
@Get(':id')
findOne(@Param('id') id: number) {
  return id;
}
```

এখানে id string আসে।

Pipe দিলে:

```ts
@Get(':id')
findOne(@Param('id', ParseIntPipe) id: number) {
  return id;
}
```

এখন Pipe:

```
"5" → 5
```

convert করবে।

---

#### ৩. Built-in Pipes (NestJS-এ ready থাকে)

NestJS-এ অনেক built-in pipe আছে।

#### ParseIntPipe

string → number

```ts
@Get(':id')
find(@Param('id', ParseIntPipe) id: number) {
  return id;
}
```

---

#### ParseBoolPipe

string → boolean

```
?active=true
```

```ts
@Get()
get(@Query('active', ParseBoolPipe) active: boolean) {
}
```

---

#### ParseUUIDPipe

UUID validate করে।

---

#### DefaultValuePipe

default value set করে।

```ts
@Get()
get(@Query('page', new DefaultValuePipe(1)) page: number) {
}
```

---

#### ValidationPipe (সবচেয়ে important)

DTO validation করার জন্য ব্যবহার হয়।

---

#### ৪. ValidationPipe কী?

ValidationPipe DTO ব্যবহার করে request body validate করে।

Example DTO

create-user.dto.ts

```ts
import { IsString, IsInt } from 'class-validator';

export class CreateUserDto {

  @IsString()
  name: string;

  @IsInt()
  age: number;

}
```

---

Controller

```ts
@Post()
create(@Body() body: CreateUserDto) {
  return body;
}
```

কিন্তু validation কাজ করবে না যতক্ষণ না pipe ব্যবহার করা হয়।

---

#### ৫. Global ValidationPipe ব্যবহার করা

`main.ts`

```ts
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());

  await app.listen(3000);
}
bootstrap();
```

---

#### এখন validation কাজ করবে

Valid request

```json
{
 "name":"Wasim",
 "age":25
}
```

---

Invalid request

```json
{
 "name":123,
 "age":"abc"
}
```

Error:

name must be a string
age must be an integer

---

#### ৬. Pipe কোথায় কোথায় ব্যবহার করা যায়?

### Parameter level

```ts
@Get(':id')
find(@Param('id', ParseIntPipe) id: number) {}
```

---

#### Method level

```ts
@Post()
@UsePipes(new ValidationPipe())
create(@Body() dto: CreateUserDto) {}
```

---

#### Controller level

```ts
@UsePipes(new ValidationPipe())
@Controller('users')
export class UserController {}
```

---

#### Global level (best practice)

```
main.ts
```

```ts
app.useGlobalPipes(new ValidationPipe());
```

---

#### ৭. Custom Pipe বানানো

নিজের Pipe বানানো যায়।

Example:

pipe/check-age.pipe.ts

```ts
import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class CheckAgePipe implements PipeTransform {

  transform(value: number) {
    if (value < 18) {
      throw new BadRequestException('Age must be above 18');
    }

    return value;
  }

}
```

---

Use

```ts
@Post()
create(@Body('age', CheckAgePipe) age: number) {
  return age;
}
```

---

#### ৮. NestJS Request Lifecycle

NestJS-এ request এই order এ যায়

```
Request
   ↓
Middleware
   ↓
Guards
   ↓
Pipes
   ↓
Interceptors
   ↓
Controller
   ↓
Service
```

Pipe Controller-এর আগে execute হয়।

---


#### Senior Developer কেন Pipe ব্যবহার করে?

কারণ:

* Controller clean থাকে
* Validation centralized হয়
* Error handling easy
* Security improve হয়
* Bad request early detect হয়

---

- ## ValidationPipe


## class-validator

NestJS-এ class-validator হলো একটি library যা DTO (Data Transfer Object) এর মাধ্যমে request data validate করার জন্য ব্যবহার করা হয়।

সহজভাবে বললে:
👉 Client থেকে যে data আসে সেটা ঠিক format-এ আছে কিনা check করার জন্য `class-validator` ব্যবহার করা হয়।

---

#### ১. class-validator কেন ব্যবহার করা হয়

ধরো client এই request পাঠালো:

```json
{
  "name": "Wasim",
  "age": 25,
  "email": "wasim@gmail.com"
}
```

এখন server চাইতে পারে:

- name অবশ্যই string
- age অবশ্যই number
- email অবশ্যই valid email

এই validation গুলো `class-validator` দিয়ে করা হয়।

---

#### ২. Install করা

NestJS project-এ সাধারণত দুইটা package লাগে:

```bash
npm install class-validator class-transformer
```

class-validator → validation rules দেয়
class-transformer → plain object কে class object বানায়

---

#### ৩. DTO কী

DTO = Data Transfer Object

মানে client থেকে আসা data structure define করা।

Example:

`
create-user.dto.ts
`

```ts
import { IsString, IsInt, IsEmail } from 'class-validator';

export class CreateUserDto {

  @IsString()
  name: string;

  @IsInt()
  age: number;

  @IsEmail()
  email: string;

}
```

এখানে `@IsString()`, `@IsInt()` এগুলো হলো decorator।

---

#### ৪. Controller-এ ব্যবহার

```ts
@Post()
createUser(@Body() body: CreateUserDto) {
  return body;
}
```

কিন্তু এখানে validation তখনই কাজ করবে যখন ValidationPipe ব্যবহার করা হবে।

---

#### ৫. ValidationPipe enable করা

`main.ts`

```ts
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {

  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());

  await app.listen(3000);
}
bootstrap();
```

---

#### ৬. এখন validation কাজ করবে

Valid request:

```json
{
 "name": "Wasim",
 "age": 25,
 "email": "wasim@gmail.com"
}
```

---

Invalid request:

```json
{
 "name": 123,
 "age": "abc",
 "email": "wrongemail"
}
```

Response error:

name must be a string
age must be an integer number
email must be an email

---

#### ৭. Common validation decorators

##### String check

```ts
@IsString()
name: string;
```

---

##### Number check

```ts
@IsInt()
age: number;
```

---

##### Email check

```ts
@IsEmail()
email: string;
```

---

##### Empty না হওয়া

```ts
@IsNotEmpty()
name: string;
```

---

##### Minimum length

```ts
@MinLength(6)
password: string;
```

---

##### Maximum length

```ts
@MaxLength(20)
username: string;
```

---

##### Minimum value

```ts
@Min(18)
age: number;
```

---

##### Maximum value

```ts
@Max(60)
age: number;
```

---

#### ৮. Multiple validation example

```ts
import {
  IsString,
  IsInt,
  IsEmail,
  MinLength,
  IsNotEmpty
} from 'class-validator';

export class CreateUserDto {

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @IsInt()
  age: number;

  @MinLength(6)
  password: string;

}
```

---

#### ৯. Optional field

যদি field optional হয়

```ts
import { IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {

  @IsOptional()
  @IsString()
  name?: string;

}
```

---

#### ১০. Validation Flow

NestJS এ validation এইভাবে কাজ করে:

```
Client Request
      ↓
DTO
      ↓
class-validator decorators
      ↓
ValidationPipe
      ↓
Controller
```

---

#### ১১. Real Example (Login API)

DTO

```ts
export class LoginDto {

  @IsEmail()
  email: string;

  @MinLength(6)
  password: string;

}
```

Controller

```ts
@Post('login')
login(@Body() body: LoginDto) {
  return body;
}
```

Invalid request:

```json
{
 "email":"wrong",
 "password":"123"
}
```

Error:

email must be an email
password must be longer than 6 characters

---