resource "openstack_networking_floatingip_v2" "floating_ip_runner" {
  pool = var.floating_ip_pool
}


resource "openstack_compute_secgroup_v2" "security_group" {
  name        = var.security_name
  description = var.security_desc
  rule {
    from_port   = 22
    to_port     = 22
    ip_protocol = "tcp"
    cidr        = "0.0.0.0/0"
  }
}

resource "openstack_compute_secgroup_v2" "security_group" {
  name        = var.security_name
  description = var.security_desc
  rule {
    from_port   = 8000
    to_port     = 8000
    ip_protocol = "tcp"
    cidr        = "0.0.0.0/0"
  }
}

resource "openstack_compute_instance_v2" "instance" {
  name            = var.name
  image_name      = var.image
  flavor_name     = var.flavor
  security_groups = [openstack_compute_secgroup_v2.security_group.name]
  key_pair        = var.keypair
  user_data       = file(var.runner_script)
}

resource "openstack_compute_floatingip_associate_v2" "floating_ip_runner" {
  floating_ip = openstack_networking_floatingip_v2.floating_ip_runner.address
  instance_id = openstack_compute_instance_v2.instance.id
}


