from smoacks.ApiClientBase import ApiClientBase

class User (ApiClientBase):
    _id_fields = 'user_id'
    _api_path = 'us/users'
    _ro_fields = {'user_id', 'source', 'record_created', 'record_updated'}

    def __init__(self, **kwargs):
        self.user_id = kwargs['user_id'] if 'user_id' in kwargs else None
        self.username = kwargs['username'] if 'username' in kwargs else None
        self.email = kwargs['email'] if 'email' in kwargs else None
        self.password = kwargs['password'] if 'password' in kwargs else None
        self.first_name = kwargs['first_name'] if 'first_name' in kwargs else None
        self.full_name = kwargs['full_name'] if 'full_name' in kwargs else None
        self.last_name = kwargs['last_name'] if 'last_name' in kwargs else None
        self.phone = kwargs['phone'] if 'phone' in kwargs else None
        self.source = kwargs['source'] if 'source' in kwargs else None
        self.create_users = kwargs['create_users'] if 'create_users' in kwargs else None
        self.create_groups = kwargs['create_groups'] if 'create_groups' in kwargs else None
        self.grant_privs = kwargs['grant_privs'] if 'grant_privs' in kwargs else None
        self.record_created = kwargs['record_created'] if 'record_created' in kwargs else None
        self.record_updated = kwargs['record_updated'] if 'record_updated' in kwargs else None

    def get_ids(self):
        return [self.user_id]