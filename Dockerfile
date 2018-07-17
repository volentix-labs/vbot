
FROM node

COPY . .

CMD ["./bin/hubot", "--adapter", "slack"]