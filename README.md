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