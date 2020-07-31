# [Terraform Visual](https://hieven.github.io/terraform-visual/)

Terraform Visual is a simple but powerful tool to help you understand your Terraform plan easily.

![Demo.gif](docs/demo.gif)

# How to use it

### Using [Terraform Visual](https://hieven.github.io/terraform-visual/)
For people who want to quickly experience how Terraform Visual looks like

1. Generate Terraform plan in JSON format

```shell
$ terraform plan -out=plan.out                # Run plan and output as a file
$ terraform show -json plan.out > plan.json   # Read plan file and output it in JSON format
```

2. Visit [Terraform Visual](https://hieven.github.io/terraform-visual/)

3. Upload Terraform JSON to the platform

### Using [CLI](https://www.npmjs.com/package/@terraform-visual/cli)
For people who want to integrate Terraform Visual into CI/CD pipeline.

Please refer to [@terraform-visual/cli](https://www.npmjs.com/package/@terraform-visual/cli) for more details

1. Install CLI
```sh
# Using Yarn
$ yarn global add @terraform-visual/cli

# Using NPM
$ npm install -g @terraform-visual/cli
```

2. Convert Terraform Plan into JSON File
```sh
$ terraform plan -out=plan.out                # Run plan and output as a file
$ terraform show -json plan.out > plan.json   # Read plan file and output it in JSON format
```

3. Create Terraform Visual Report
```sh
$ terraform-visual --plan plan.json
```

4. Browse The Report
```sh
$ open terraform-visual-report/index.html
```
