/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { readNotifications } from './read_notifications';
import { rulesClientMock } from '../../../../../alerting/server/mocks';
import {
  getNotificationResult,
  getFindNotificationsResultWithSingleHit,
} from '../routes/__mocks__/request_responses';

class TestError extends Error {
  constructor() {
    super();

    this.name = 'CustomError';
    this.output = { statusCode: 404 };
  }
  public output: { statusCode: number };
}

describe('read_notifications', () => {
  let rulesClient: ReturnType<typeof rulesClientMock.create>;

  beforeEach(() => {
    rulesClient = rulesClientMock.create();
  });

  describe('readNotifications', () => {
    test('should return the output from rulesClient if id is set but ruleAlertId is undefined', async () => {
      rulesClient.get.mockResolvedValue(getNotificationResult());

      const rule = await readNotifications({
        rulesClient,
        id: '04128c15-0d1b-4716-a4c5-46997ac7f3bd',
        ruleAlertId: undefined,
      });
      expect(rule).toEqual(getNotificationResult());
    });
    test('should return null if saved object found by alerts client given id is not alert type', async () => {
      const result = getNotificationResult();
      // @ts-expect-error
      delete result.alertTypeId;
      rulesClient.get.mockResolvedValue(result);

      const rule = await readNotifications({
        rulesClient,
        id: '04128c15-0d1b-4716-a4c5-46997ac7f3bd',
        ruleAlertId: undefined,
      });
      expect(rule).toEqual(null);
    });

    test('should return error if alerts client throws 404 error on get', async () => {
      rulesClient.get.mockImplementation(() => {
        throw new TestError();
      });

      const rule = await readNotifications({
        rulesClient,
        id: '04128c15-0d1b-4716-a4c5-46997ac7f3bd',
        ruleAlertId: undefined,
      });
      expect(rule).toEqual(null);
    });

    test('should return error if alerts client throws error on get', async () => {
      rulesClient.get.mockImplementation(() => {
        throw new Error('Test error');
      });
      try {
        await readNotifications({
          rulesClient,
          id: '04128c15-0d1b-4716-a4c5-46997ac7f3bd',
          ruleAlertId: undefined,
        });
      } catch (exc) {
        expect(exc.message).toEqual('Test error');
      }
    });

    test('should return the output from rulesClient if id is set but ruleAlertId is null', async () => {
      rulesClient.get.mockResolvedValue(getNotificationResult());

      const rule = await readNotifications({
        rulesClient,
        id: '04128c15-0d1b-4716-a4c5-46997ac7f3bd',
        ruleAlertId: null,
      });
      expect(rule).toEqual(getNotificationResult());
    });

    test('should return the output from rulesClient if id is undefined but ruleAlertId is set', async () => {
      rulesClient.get.mockResolvedValue(getNotificationResult());
      rulesClient.find.mockResolvedValue(getFindNotificationsResultWithSingleHit());

      const rule = await readNotifications({
        rulesClient,
        id: undefined,
        ruleAlertId: 'rule-1',
      });
      expect(rule).toEqual(getNotificationResult());
    });

    test('should return null if the output from rulesClient with ruleAlertId set is empty', async () => {
      rulesClient.get.mockResolvedValue(getNotificationResult());
      rulesClient.find.mockResolvedValue({ data: [], page: 0, perPage: 1, total: 0 });

      const rule = await readNotifications({
        rulesClient,
        id: undefined,
        ruleAlertId: 'rule-1',
      });
      expect(rule).toEqual(null);
    });

    test('should return the output from rulesClient if id is null but ruleAlertId is set', async () => {
      rulesClient.get.mockResolvedValue(getNotificationResult());
      rulesClient.find.mockResolvedValue(getFindNotificationsResultWithSingleHit());

      const rule = await readNotifications({
        rulesClient,
        id: null,
        ruleAlertId: 'rule-1',
      });
      expect(rule).toEqual(getNotificationResult());
    });

    test('should return null if id and ruleAlertId are null', async () => {
      rulesClient.get.mockResolvedValue(getNotificationResult());
      rulesClient.find.mockResolvedValue(getFindNotificationsResultWithSingleHit());

      const rule = await readNotifications({
        rulesClient,
        id: null,
        ruleAlertId: null,
      });
      expect(rule).toEqual(null);
    });

    test('should return null if id and ruleAlertId are undefined', async () => {
      rulesClient.get.mockResolvedValue(getNotificationResult());
      rulesClient.find.mockResolvedValue(getFindNotificationsResultWithSingleHit());

      const rule = await readNotifications({
        rulesClient,
        id: undefined,
        ruleAlertId: undefined,
      });
      expect(rule).toEqual(null);
    });
  });
});
