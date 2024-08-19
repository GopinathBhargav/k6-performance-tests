# k6-performance-tests

# Command to run scripts

k6 run <filepath/filename.js>

# connect K6 cloud to the repository

k6 login cloud --token <token-id>

# Command to run scripts in k6 cloud

k6 cloud <filepath/filename.js>

# pass options using CLI

k6 run first-test.js --vus 1 --duration 10s --iterations 1

# to by pass insecure TLS browser URL

k6 run first-test.js --insecure-skip-tls-verify

# to output test results as JSON

k6 run first-test.js --out json=<filename.json>

# we can even execute the scripts in local and export them to cloud, thsi scenario is helpful when the servers are not publicly accessible from organization and infrastructure is in-house

k6 run <filepath/filename.js> -o cloud //[Here o stands for output]
