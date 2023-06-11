import accountSetting from '../services/header.service'

const account = {
  displayName:   accountSetting.userName(),
  photoURL: '/assets/images/avatars/avatar_default.jpg',
};

export default account;
