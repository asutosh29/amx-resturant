-- (Depraciated) After creating an account with the following credentials run this to add Admin
update users
set userRole = 'admin'
where email='admin@test.com';

-- By default the first user who is registered is by default the super user