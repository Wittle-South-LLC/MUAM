from smoacks.ApiClientBase import ApiClientBase

class Membership (ApiClientBase):
    _id_fields = {'group_id', 'user_id'}
    _api_path = 'us/memberships'
    _ro_fields = set()
    _float_fields = set()
    _int_fields = set()

    def __init__(self, **kwargs):
        self.group_id = kwargs['group_id'] if 'group_id' in kwargs else None
        self.user_id = kwargs['user_id'] if 'user_id' in kwargs else None
        self.is_owner = kwargs['is_owner'] if 'is_owner' in kwargs else None
        self.is_admin = kwargs['is_admin'] if 'is_admin' in kwargs else None

    def get_ids(self):
        return [self.group_id, self.user_id]