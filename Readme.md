# Cypress demo for Greencodesoftware.com site

## How to run

### Prerequisites
> node.js installed
> npm installed

### Instructions
Clone project and cd into directory

### Development mode
```
npm install
npm run cy:open 
```

### Headless/CIrun
```
npm run cy:run
```

> viewportWidth and viewportHeight have been set to 1920x1080 for desktop resolution testing only.
> browser used is electron. pass --browser=chrome argument to cy:open/cy:run scripts to use chrome by default