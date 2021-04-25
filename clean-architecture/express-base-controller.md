<sup>[node-design-patterns](https://github.com/moatorres/node-design-patterns/blob/master/) / [clean-architecture](https://github.com/moatorres/node-design-patterns/blob/master/clean-architecture/) / [express-base-controller](https://github.com/moatorres/node-design-patterns/blob/master/clean-architecture/express-base-controller.md)</sup>

# Clean Architecture

## Express Base Controller

### JavaScript

Example implementation written in `JavaScript`

```js
export class ExpressBaseController {
  execute(req, res) {
    this.req = req
    this.res = res
    this.executeImpl()
  }

  static jsonResponse(res, code, message) {
    return res.status(code).json({ message })
  }

  ok(res, dto) {
    if (!!dto) {
      return res.status(200).json(dto)
    } else {
      return res.sendStatus(200)
    }
  }

  created(res) {
    return res.sendStatus(201)
  }

  clientError(message) {
    return ExpressBaseController.jsonResponse(
      this.res,
      400,
      message ? message : 'Unauthorized'
    )
  }

  unauthorized(message) {
    return ExpressBaseController.jsonResponse(
      this.res,
      401,
      message ? message : 'Unauthorized'
    )
  }

  paymentRequired(message) {
    return ExpressBaseController.jsonResponse(
      this.res,
      402,
      message ? message : 'Payment required'
    )
  }

  forbidden(message) {
    return ExpressBaseController.jsonResponse(
      this.res,
      403,
      message ? message : 'Forbidden'
    )
  }

  notFound(message) {
    return ExpressBaseController.jsonResponse(
      this.res,
      404,
      message ? message : 'Not found'
    )
  }

  conflict(message) {
    return ExpressBaseController.jsonResponse(
      this.res,
      409,
      message ? message : 'Conflict'
    )
  }

  tooMany(message) {
    return ExpressBaseController.jsonResponse(
      this.res,
      429,
      message ? message : 'Too many requests'
    )
  }

  todo() {
    return ExpressBaseController.jsonResponse(this.res, 400, 'TODO')
  }

  fail(error) {
    console.log(error)
    return this.res.status(500).json({
      message: error.toString(),
    })
  }
}
```

### TypeScript

Example implementation written in `TypeScript`

```ts
import * as express from 'express'

export abstract class BaseController {
  // or even private
  protected req: express.Request
  protected res: express.Response

  protected abstract executeImpl(): Promise<void | any>

  public execute(req: express.Request, res: express.Response): void {
    this.req = req
    this.res = res

    this.executeImpl()
  }

  public static jsonResponse(
    res: express.Response,
    code: number,
    message: string
  ) {
    return res.status(code).json({ message })
  }

  public ok<T>(res: express.Response, dto?: T) {
    if (!!dto) {
      return res.status(200).json(dto)
    } else {
      return res.sendStatus(200)
    }
  }

  public created(res: express.Response) {
    return res.sendStatus(201)
  }

  public clientError(message?: string) {
    return BaseController.jsonResponse(
      this.res,
      400,
      message ? message : 'Unauthorized'
    )
  }

  public unauthorized(message?: string) {
    return BaseController.jsonResponse(
      this.res,
      401,
      message ? message : 'Unauthorized'
    )
  }

  public paymentRequired(message?: string) {
    return BaseController.jsonResponse(
      this.res,
      402,
      message ? message : 'Payment required'
    )
  }

  public forbidden(message?: string) {
    return BaseController.jsonResponse(
      this.res,
      403,
      message ? message : 'Forbidden'
    )
  }

  public notFound(message?: string) {
    return BaseController.jsonResponse(
      this.res,
      404,
      message ? message : 'Not found'
    )
  }

  public conflict(message?: string) {
    return BaseController.jsonResponse(
      this.res,
      409,
      message ? message : 'Conflict'
    )
  }

  public tooMany(message?: string) {
    return BaseController.jsonResponse(
      this.res,
      429,
      message ? message : 'Too many requests'
    )
  }

  public todo() {
    return BaseController.jsonResponse(this.res, 400, 'TODO')
  }

  public fail(error: Error | string) {
    console.log(error)
    return this.res.status(500).json({
      message: error.toString(),
    })
  }
}
```

From this [repo](https://github.com/stemmlerjs/white-label/blob/master/src/core/infra/BaseController.ts) written by [@stemmlerjs](https://github.com/stemmlerjs)
