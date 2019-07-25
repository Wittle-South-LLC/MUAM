from smoacks.ApiClientBase import ApiClientBase

class Group (ApiClientBase):
    _id_fields = 'group_id'
    _api_path = 'us/groups'
    _ro_fields = {'source', 'record_created', 'record_updated', 'group_id'}
    _float_fields = set()
    _int_fields = {'gid'}

    def __init__(self, **kwargs):
        self.description = kwargs['description'] if 'description' in kwargs else None
        self.source = kwargs['source'] if 'source' in kwargs else None
        self.profiles = kwargs['profiles'] if 'profiles' in kwargs else None
        self.record_created = kwargs['record_created'] if 'record_created' in kwargs else None
        self.record_updated = kwargs['record_updated'] if 'record_updated' in kwargs else None
        self.group_id = kwargs['group_id'] if 'group_id' in kwargs else None
        self.gid = kwargs['gid'] if 'gid' in kwargs else None
        self.name = kwargs['name'] if 'name' in kwargs else None

    def get_ids(self):
        return [self.group_id]