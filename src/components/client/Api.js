import { v4 as uuidv4 } from 'uuid';

// Mocked localStorage
const localStorage = {
  getItem: (key) => window.localStorage.getItem(key),
  setItem: (key, value) => window.localStorage.setItem(key, value),
};

const hostname = 'https://rivian.com';
const graphqlPath = '/api/gql/gateway/graphql';

let csrfToken = '';
let appSessionToken = '';
let accessToken = '';
let refreshToken = '';
let userSessionToken = '';

const loadSessionState = () => {
  csrfToken = localStorage.getItem('csrfToken') || '';
  appSessionToken = localStorage.getItem('appSessionToken') || '';
  
  accessToken = localStorage.getItem('accessToken') || '';
  refreshToken = localStorage.getItem('refreshToken') || '';
  userSessionToken = localStorage.getItem('userSessionToken') || '';

  // Check if tokens exist and return true or false
  return !!accessToken && !!refreshToken && !!userSessionToken;
};

const saveSessionState = () => {
  localStorage.setItem('csrfToken', csrfToken);
  localStorage.setItem('appSessionToken', appSessionToken);
  localStorage.setItem('accessToken', accessToken);
  localStorage.setItem('refreshToken', refreshToken);
  localStorage.setItem('userSessionToken', userSessionToken);
};

const executeGraphQLQuery = async (path, query, variables = {}, isLoginCommand = false, csrfTokenRequired = true) => {
  if (csrfTokenRequired) {
    await createCsrfToken();
  }

  const body = JSON.stringify({ query, variables });
  const headers = {
    'Content-Type': 'application/json',
    'Apollographql-Client-Name': 'com.rivian.ios.consumer-apollo-ios',
  };

  if (csrfToken) {
    headers['Csrf-Token'] = csrfToken;
  }

  if (appSessionToken) {
    headers['A-Sess'] = appSessionToken;
  }

  if (userSessionToken) {
    headers['U-Sess'] = userSessionToken;
  }

  if (isLoginCommand) {
    headers['Dc-Cid'] = `m-ios-${uuidv4()}`;
  }

  return fetch(`${hostname}${path}`, {
    method: 'POST',
    headers,
    body,
  });
};

const createCsrfToken = async () => {
  const createCsrfTokenQuery = `mutation CreateCSRFToken {
    createCsrfToken {
      __typename
      csrfToken
      appSessionToken
    }
  }`;

  const response = await executeGraphQLQuery(graphqlPath, createCsrfTokenQuery, {}, false, false);
  const body = await response.json();
  csrfToken = body.data.createCsrfToken.csrfToken;
  appSessionToken = body.data.createCsrfToken.appSessionToken;
  saveSessionState();
};

const login = async (email, password) => {
  const loginQuery = `mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      __typename
      ... on MobileLoginResponse {
        __typename
        accessToken
        refreshToken
        userSessionToken
      }
      ... on MobileMFALoginResponse {
        __typename
        otpToken
      }
    }
  }`;

  const variables = { email, password };
  const response = await executeGraphQLQuery(graphqlPath, loginQuery, variables, true);
  
  if (!response.ok) {
    throw new Error(`Unknown network error occurred: ${response.status}`);
  }

  const body = await response.json();

  if (body.errors && body.errors.length > 0) {
    const graphqlError = body.errors[0];
    throw new Error(graphqlError.message);
  }

  if (body.data.login.__typename === 'MobileLoginResponse') {
    accessToken = body.data.login.accessToken;
    refreshToken = body.data.login.refreshToken;
    userSessionToken = body.data.login.userSessionToken;
    saveSessionState();
  }
  
  return body;
};

const getLiveSessionHistory = async (vehicleId) => {
  const query = `
    query getLiveSessionHistory($vehicleId: ID!) {
      getLiveSessionHistory(vehicleId: $vehicleId) {
        transactionId
        vehicleId
        startTime
        current {
          updatedAt
          value
        }
        chargerId
      }
    }
  `;

  const variables = { vehicleId };

  return executeGraphQLQuery(graphqlPath, query, variables);
};

const getCompletedSessionSummaries = async (vehicleId) => {
  const query = `
    query getCompletedSessionSummaries($vehicleId: String!) {
      getCompletedSessionSummaries(vehicleId: $vehicleId) {
        __typename
        chargerType
        currencyCode
        paidTotal
        startInstant
        endInstant
        totalEnergyKwh
        rangeAddedKm
        city
        transactionId
        vehicleId
        vehicleName
        vendor
        isRoamingNetwork
        isPublic
        isHomeCharger
        meta {
          __typename
          transactionIdGroupingKey
          dataSources
        }
      }
    }
  `;

  // const variables = { vehicleId };
  // return executeGraphQLQuery(graphqlPath, query, {variables});

  return executeGraphQLQuery(graphqlPath, query, {});
}

export { loadSessionState, login, getLiveSessionHistory, getCompletedSessionSummaries };