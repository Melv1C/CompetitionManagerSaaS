#!/bin/bash

# Navigate to shared-packages directory
cd shared-packages || exit

# Loop through each folder and run npm install and npm build
for dir in */; do
    if [ -d "$dir" ]; then
        cd "$dir" || continue
        echo "Running npm install and npm build in $dir"
        npm install
        
        if [ "$dir" == "prisma/" ]; then
            if [ "$1" == "-m" ]; then              # If the 1 argument is -m, run npm run migrate else run npm run generate
                echo "Running npm run generate in $dir"
                npm run generate
            else
                echo "Running npm run migrate in $dir"
                npm run migrate
            fi
        fi

        npm run build
        
        cd ..
    fi
done