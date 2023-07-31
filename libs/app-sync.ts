import API, { graphqlOperation } from '@aws-amplify/api';
import { Observable } from 'zen-observable-ts';
import Amplify from '@aws-amplify/core';

export const appSyncConfig = {
  aws_appsync_graphqlEndpoint: process.env.NEXT_PUBLIC_APPSYNC_ENDPOINT,
  aws_appsync_region: process.env.NEXT_PUBLIC_APPSYNC_REGION,
  aws_appsync_authenticationType: 'API_KEY',
  aws_appsync_apiKey: process.env.NEXT_PUBLIC_APPSYNC_API_KEY,
};

Amplify.configure(appSyncConfig);

export const subscribeDoc = /* GraphQL */ `
  subscription Subscribe($name: String!) {
    subscribe(name: $name) {
      data
      name
    }
  }
`;

export const publishDoc = /* GraphQL */ `
  mutation Publish($data: AWSJSON!, $name: String!) {
    publish(data: $data, name: $name) {
      data
      name
    }
  }
`;

/**
 * @param  {string} name the name of the channel
 * @param  {Object} data the data to publish to the channel
 */
// refactor any to specific models for chat and notifications.
export async function publish(name: string, data: any) {
  return await API.graphql(graphqlOperation(publishDoc, { name, data: JSON.stringify(data) }));
}

/**
 * @param  {string} name the name of the channel
 * @param  {nextCallback} next callback function that will be called with subscription payload data
 * @param  {function} [error] optional function to handle errors
 * @returns {Observable} an observable subscription object
 */
export function subscribe(
  name: string,
  next: (subscribe: any, provider: any, value: any) => void,
  error?: () => void
) {
  return (
    API.graphql(graphqlOperation(subscribeDoc, { name })) as Observable<object>
  ).subscribe({
    next: ({ provider, value }: any) => {
      next(value.data.subscribe, provider, value);
    },
    error: error || console.log,
  });
}

/**
 * @callback nextCallback
 * @param {Object} data the subscription response including the `name`, and `data`.
 * @param {Object} [provider] the provider object
 * @param {Object} [payload] the entire payload
 */
