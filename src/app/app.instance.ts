import express from 'express';

export class Application {
  private static app: express.Express;

  static getInstance(): express.Express {
    if (!Application.app) {
      Application.app = express();
    }
    return Application.app;
  }
}
