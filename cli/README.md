# Terraform Visual CLI

Terraform Visual CLI is an easy-to-use command line tool to generate an interactive static HTML page visualizing provided Terraform plan.

![Demo.gif](https://media2.giphy.com/media/XEsCd9XRvctqBnkMtf/giphy.gif)

## Installation
```sh
# Using Yarn
$ yarn global add @terraform-visual/cli

# Using NPM
$ npm install -g @terraform-visual/cli
```

## Usage
### Convert Terraform Plan into JSON File
```sh
$ terraform plan -out=plan.out              # Run plan and output as a file
$ terraform show -json plan.out > plan.json # Read plan file and output it in JSON format
```

### Create Terraform Visual Report
```sh
$ terraform-visual --plan plan.json
```

### Browse The Report
```sh
$ open terraform-visual-report/index.html
```

## Options
| Field | Required | Default | Remark                                                             |
|-------|----------|---------|--------------------------------------------------------------------|
| out   | X        | `.`     | Relative path from current dir to generate Terraform-Visual report |
| plan  | V        | `n/a`   | Relative path to the generated plan JSON file                      |
