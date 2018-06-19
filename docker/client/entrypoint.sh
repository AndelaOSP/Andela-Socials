#!/bin/bash
if [[ $DEBUG == 'TRUE' ]]; then
  npm run start:dev
else
   npm run start
fi
