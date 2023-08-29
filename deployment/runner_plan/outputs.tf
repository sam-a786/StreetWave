output "runner_server" { value = "Runner server ip: ${openstack_networking_floatingip_v2.floating_ip_runner.address}" }
