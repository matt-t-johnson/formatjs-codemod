#!/bin/sh
set -e

# Copies files useful for managing i18n to source project

# Get argument flags
while getopts t:s:f: flag
do
    case "${flag}" in
        t) toolsOutputPath=${OPTARG};;
        s) sourceOutputPath=${OPTARG};;
        f) filesToCopyPath=${OPTARG};;
    esac
done

echo "==> Creating $toolsOutputPath directory"
mkdir -p $toolsOutputPath

echo "==> Adding i18n tool files to $toolsOutputPath"
cd $toolsOutputPath
cp -r $filesToCopyPath/i18n-tools/. $toolsOutputPath

echo "==> Creating $sourceOutputPath directory"
cd ..
mkdir -p $sourceOutputPath

echo "==> Adding i18n source files to $sourceOutputPath"
cd $sourceOutputPath
cp -r $filesToCopyPath/source-files/. $sourceOutputPath
