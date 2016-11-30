## DEPLOY.md

Steps to deploy the bot on EC2: 

1. Install boto (used for AWS) using ``` sudo apt-get install python boto ```
2. Create a hosts file and paste the following: 
  ```[local] ```
  ```localhost ```
3. Create an IAM group using https://console.aws.amazon.com/iam/home#home and assign roles to that group. Create a user to add to the deployment group. 
4. Download user credentials for that user and store them as environment variables. (AWS_ACCESS_KEY & AWS_SECRET_KEY)
5. Also create a keypair for the new instances that you create it. Move that .pem file to ```~/.ssh/```and set its permission to 600. 
6. Create a security group for the instaces and allow all ICMP and TCP traffic through firewall. 
7. Run the playbook using ```AWS_ACCESS_KEY=xxxxx AWS_SECRET_KEY="xxxx" ansible-playbook -i hosts site.yml```


###Links: 

1. Acceptance Testing - https://github.ncsu.edu/dasoni/EnvBot/blob/master/Acceptance%20Test.md
2. Bot Code - https://github.ncsu.edu/dasoni/EnvBot/tree/master/bot
3. Screencast - https://youtu.be/WgvF_FzvKmA
