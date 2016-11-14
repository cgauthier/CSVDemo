# CSV Validator Demo

## Written using ExtJS 6.02

The purpose of this app is to demonstrate a way of sanitizing CSV files using a template engine.

In the repository, there is a data folder, you should copy this to your files system locally.

The demo is available at: http://www.claudegauthier.net/demos/CSVDEMO/

The application's "Browse..." button allows you to parse files and determine their validity.  If a file is successfully validated, a JSON will be created for it.

Again, the files in the data folder are various scenarios which are named based on the test they executed.

The validation is abstracted in a file located under resources/validation_templates/Generic.json.

The rules in this file are loaded in the application and the file being browsed is validated against those rules.

Note: This code is WIP and a proof of concept, so it's not highly optimized at this point.