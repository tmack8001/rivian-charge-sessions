# Rivian Charging Sessions

This project provides a ReactJS web application to fetch and display charging history for Rivian vehicles. It interacts with Rivian's GraphQL API to retrieve charging session data.

## Features

- **Web Application:** Access charging session history through a user-friendly web interface.
- (coming soon) **Downloadable CSV:** Export charging session data as CSV for further analysis.
- **Secure Authentication:** Log in securely to access charging history data. (username and password is only sent to rivian.com and exchanged tokens are stored locally in your browser)

## Development

To run the web application:

```bash
cd rivian-charging-history
yarn install
yarn build
serve -s build
```

## Usage

### Web Application
- Open the web application in your browser.
- Log in with your Rivian account credentials.
- Access your charging history and download CSV reports.


## Technologies Used
- Node.js
- ReactJS
- GraphQL
- Node-fetch
- json2csv
- LocalStorage

## Contributors

- [Trevor Mack](https://github.com/tmack8001) (Project Lead / AI Prompt Engineer)
- [OpenAI Assistant](https://github.com/openai) (Provided assistance with project development)

## Contributors
This project is licensed under the MIT License - see the [LICENSE.md](./LICENSE.md) file for details.