# Cleanup Lambda Versions

Removes outdated AWS Lambda versions to prevent "Code Storage Limit Exceeded" error

## Usage

Install the CLI tool

```bash
npm i -g cleanup-lambda-versions
```

List function versions to clear

```bash
npm cleanup-lambda-versions <aws region>
```

Confirm removal

```bash
npm cleanup-lambda-versions <aws region> confirm
```