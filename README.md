
# UNOFFICAL-DTU-API

This repository contains the source code for the DTU Unofficial API, a project that aims to provide a simple and easy-to-use interface for accessing various data and services from the Delhi Technological University (DTU). The API is built with Nodejs and express and uses web scraping and reverse engineering techniques to obtain information from DTU's official websites and applications. The API is not affiliated with or endorsed by DTU, and is intended for educational and research purposes only. Use it at your own risk and respect the terms and conditions of the original sources.

Production [link](https://twitter.com/)






## API Reference
```http
  GET /
```

Get API STATUS  
#### Get notices by category

```http
  GET /info/{Parameter}
```

| Parameter | Type     | Notice type                |
| :-------- | :------- | :------------------------- |
| `latest_news` | `string` |   |
| `notices` | `string` |   |
| `firstyear` | `string` |   |
| `jobs` | `string` |   |
| `events` | `string` |   |

#### Get Student information **(Takes time)**

```http
  GET /student-info/:name/:password
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `name`      | `string` | **Required**.User id|
| `password`      | `string` | **Required**.user id password|

#### search professor via query

```http
  GET /search/professor_id/:query
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `query`      | `string` | **Required**. search query for professors |

