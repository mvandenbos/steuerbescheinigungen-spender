# Steuerbescheinigungen Spender
This application generates tax donation documents for individuals.  This uses a [Churchtools](https://www.church.tools/en/home) API to get person data and an imported Addison Donation export (csv/xlsx) or custom excel file (Bank export, etc.) to generate the final donation documents.

## To Use

To clone and run this repository you'll need [Git](https://git-scm.com),  [Node.js](https://nodejs.org/en/download/) (which comes with [npm](http://npmjs.com)) and [Electron](https://electronjs.org/) installed on your computer. From your command line:

```bash
# Clone this repository
git clone https://github.com/mvandenbos/steuerbescheinigungen-spender.git
# Go into the repository
cd steuerbescheinigungen-spender
# Install dependencies
yarn install
# Run the app
yarn start
```

## Packaging the Application

To package the application as a stand-alone app use the following commands:

```bash
# Ensure you are in the root directory of the repository
# run the package script
yarn package
# Verify that the applicaiton was packaged in the out directory
cd out
```

## Making the Application

To create an executable installer for your packaged app use the following commands:

```bash
# Ensure you are in the root directory of the repository
# run the make script
yarn make

# Or to force making a 32 bit application
yarn make32

# Verify that the executable was created in the out/make directory
cd out/make
```

## Auto-Updates

This executable installer application has an auto-updater built into it using [electron-simple-updater](https://www.npmjs.com/package/electron-simple-updater).