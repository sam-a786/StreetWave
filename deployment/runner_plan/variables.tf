variable "flavor" { default = "m1.medium" }
variable "image" { default = "CentOS 7 20201112" }
variable "name" { default = "CentOS Runner Instance" }
variable "keypair" { default = "streetwave_personal" } # Change this when ready to gitlab ssh
variable "floating_ip_pool" { default = "cscloud_private_floating" }
variable "runner_script" { default = "./runner_server.sh" }
variable "security_name" { default = "runner_security_group" }
variable "security_desc" { default = "runner_security_description" }