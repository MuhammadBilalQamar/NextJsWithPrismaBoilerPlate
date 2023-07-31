/* eslint-disable no-unused-vars */
import { NextApiRequest, NextApiResponse } from 'next';

interface errorResponse {
  error: any;
}

export default class restHandlers {
  model: any;
  softDelete = true;

  constructor(req: NextApiRequest, res: NextApiResponse) {
    setTimeout(() => this.handleRequest(req, res));
  }

  beforeGet = async (
    req: NextApiRequest,
    where: any,
    include: any,
    skip: number,
    take: number,
    session: null,
    orderBy: any
  ): Promise<void> => {};

  beforeUpdate = async (
    req: NextApiRequest,
    body: any,
    where: any,
    dbData: any,
    session: null
  ): Promise<void> => {};
  beforeInsert = async (
    req: NextApiRequest,
    body: any,
    session: null
  ): Promise<void> => {};
  beforeDelete = async (
    req: NextApiRequest,
    where: any,
    session: null
  ): Promise<void> => {};

  afterGet = async (
    req: NextApiRequest,
    data: any,
    where: any,
    include: any,
    session: null
  ): Promise<void> => {};
  afterUpdate = async (
    req: NextApiRequest,
    data: any,
    body: any,
    where: any,
    session: null
  ): Promise<void> => {};
  afterInsert = async (
    req: NextApiRequest,
    data: any,
    body: any,
    session: any
  ): Promise<void> => {};
  afterDelete = async (
    req: NextApiRequest,
    data: any,
    where: any,
    session: null
  ): Promise<void> => {};

  canGet = async (
    req: NextApiRequest,
    res: NextApiResponse,
    where: any
  ): Promise<null> => await this.auth(req, res);
  canUpdate = async (
    req: NextApiRequest,
    res: NextApiResponse,
    body: any,
    where: any
  ): Promise<null> => await this.auth(req, res);
  canInsert = async (
    req: NextApiRequest,
    res: NextApiResponse,
    body: any
  ): Promise<null> => await this.auth(req, res);
  canDelete = async (
    req: NextApiRequest,
    res: NextApiResponse,
    where: any
  ): Promise<null> => await this.auth(req, res);

  handleGet = async <T>(
    req: NextApiRequest,
    res: NextApiResponse<T | { data: T[]; nextCursor: number } | errorResponse>
  ) => {
    try {
      let id;
      const skip = req.query.cursor ? parseInt(req.query.cursor as string) : 0;
      let take = req.query.limit ? parseInt(req.query.limit as string) : 12;
      if (req.query.id && req.query.id[0]) {
        id = req.query.id[0];
      }
      const where: any = id ? { id } : {};
      if (this.softDelete) {
        where['deleted'] = false;
      }

      const include: any = {};
      if (typeof req.query.include === 'string') {
        req.query.include.split(',').forEach((item) => {
          include[item.trim()] = true;
        });
      }
      const session = await this.canGet(req, res, where);
      const orderBy: any = req.query.order
        ? { createdAt: req.query.order }
        : { createdAt: 'desc' };
      await this.beforeGet(req, where, include, skip, take, session, orderBy);
      const recordsLength = await this.model.count({ where });
      const all = req.query.all;
      if (all) take = recordsLength;

      const data = await this.model.findMany({
        where,
        skip,
        take,
        include: Object.keys(include).length === 0 ? null : include,
        orderBy,
      });
      await this.afterGet(req, data, where, include, session);
      if (!id || data.length > 0) {
        res
          .status(200)
          .json(
            id ? data[0] : { data, nextCursor: skip + take, recordsLength }
          );
      } else {
        res.status(404).json({ error: 'no record found' });
      }
    } catch (error: any) {
      console.log('error======>', error);
      res.status(error.status || 500).json({ error });
    }
  };
  handlePost = async <T>(
    req: NextApiRequest,
    res: NextApiResponse<
      | { success: boolean; createdData: T; timeTakenToInset: number }
      | errorResponse
    >
  ) => {
    try {
      const startTime = new Date().getTime();
      const body: any = {};
      const session = await this.canInsert(req, res, body);
      await this.beforeInsert(req, body, session);

      const data = await this.model.create({
        data: body,
      });

      await this.afterInsert(req, data, body, session);
      const endTime = new Date().getTime();
      res.status(200).json({
        success: true,
        createdData: data,
        timeTakenToInset: endTime - startTime,
      });
    } catch (error: any) {
      console.log('error======>', error);
      res.status(error.status || 500).json({ error });
    }
  };
  handlePut = async <T>(
    req: NextApiRequest,
    res: NextApiResponse<{ success: boolean; updatedData: T } | errorResponse>
  ) => {
    try {
      const body: any = {};
      let where: any = {};
      let dbData: any, id;

      if (this.softDelete) {
        where['deleted'] = false;
      }
      body['updatedAt'] = new Date();

      if (req.query.id && req.query.id[0]) {
        id = req.query.id[0];
        where['id'] = id;
        dbData = await this.model.findMany({
          where,
        });
      } else {
        throw { error: 'id is missing', status: 400 };
      }
      const session = await this.canUpdate(req, res, body, where);
      await this.beforeUpdate(req, body, where, dbData, session);
      const data = await this.model.updateMany({
        where,
        data: body,
      });
      await this.afterUpdate(req, data, body, where, session);
      res.status(200).json({ success: true, updatedData: data });
    } catch (error: any) {
      console.log(error);
      res.status(error.status || 500).json({ error });
    }
  };
  handleDelete = async <T>(
    req: NextApiRequest,
    res: NextApiResponse<{ success: boolean } | errorResponse>
  ) => {
    try {
      let id,
        data,
        where: any = {};
      if (req.query.id && req.query.id[0]) {
        id = req.query.id[0];
        where['id'] = id;
      } else {
        throw { error: 'id is missing', status: 400 };
      }
      const session = await this.canDelete(req, res, where);
      await this.beforeDelete(req, where, session);
      if (this.softDelete) {
        data = await this.model.updateMany({
          where,
          data: {
            deleted: true,
          },
        });
      } else {
        data = await this.model.delete({ where });
      }
      await this.afterDelete(req, data, where, session);
      res.status(200).json({ success: true });
    } catch (error: any) {
      res.status(error.status || 500).json({ error });
    }
  };

  async auth(req: NextApiRequest, res: NextApiResponse): Promise<any> {
    try {
      const session = req.cookies;
      //@ts-ignore
      session.user = JSON.parse(req?.cookies['user-details']) || {};
      return session;
    } catch (error) {
      return null;
    }
  }

  async handleRequest(req: NextApiRequest, res: NextApiResponse) {
    switch (req.method) {
      case 'GET':
        await this.handleGet(req, res);
        break;
      case 'POST':
        await this.handlePost(req, res);
        break;
      case 'PUT':
        await this.handlePut(req, res);
        break;
      case 'DELETE':
        await this.handleDelete(req, res);
        break;
      default:
    }
  }
}
