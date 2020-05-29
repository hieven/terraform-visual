# Terraform Visual

Terraform Visual is a simple but powerful tool to help you understand your Terraform plan easily.

## Demo
![Demo.gif](docs/demo.gif)

or go directly to https://hieven.github.io/terraform-visual/ and upload your Terraform plan

## How to use it

1. Generate Terraform plan in JSON format

```shell
$ terraform plan -out=plan.out
$ terraform show -json plan.out > plan.json
```

2. Visit [Terraform Visual](https://hieven.github.io/terraform-visual/)

3. Upload Terraform JSON to the platform


## How to run it locally
1. Clone the repo

```shell
$ git clone git@github.com:hieven/terraform-visual.git
```

2. Install NPM dependencies

```shell
$ yarn
```

3. Start development mode

```shell
$ npm run dev
```