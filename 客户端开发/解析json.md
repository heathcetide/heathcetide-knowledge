```plain
static _LS<String> user_avatar = _LS('user_avatar');
static _LS<String> user_userName = _LS('user_userName');
static _LS<String> user_email = _LS('email');
static _LS<String> user_phone = _LS('phone');
static _LS<String> user_address = _LS('address');
static _LS<String> user_points = _LS('points');
static _LS<String> user_articleCount = _LS('articleCount');
static _LS<String> user_activityCount = _LS('activityCount');
static _LS<String> user_gender = _LS('gender');
static _LS<String> user_bio = _LS('bio');
static _LS<String> user_birthday = _LS('birthday');
static _LS<String> user_lastLoginTime = _LS('lastLoginTime');
static _LS<String> user_createdAt = _LS('createdAt');
```

```plain
class UserInfo {
  final String username;
  final String email;
  final String phone;
  final String address;
  final int points;
  final int articleCount;
  final int activityCount;
  final String passwordSalt;
  final String avatarUrl;
  final int gender;
  final String bio;
  final String birthday;
  final String lastLoginTime;
  final String createdAt;

  UserInfo({
    required this.username,
    required this.email,
    required this.phone,
    required this.address,
    required this.points,
    required this.articleCount,
    required this.activityCount,
    required this.passwordSalt,
    required this.avatarUrl,
    required this.gender,
    required this.bio,
    required this.birthday,
    required this.lastLoginTime,
    required this.createdAt,
  });

  // 通过工厂方法从JSON解析数据
  factory UserInfo.fromJson(Map<String, dynamic> json) {
    return UserInfo(
      username: json['username'],
      email: json['email'],
      phone: json['phone'],
      address: json['address'],
      points: json['points'],
      articleCount: json['articleCount'],
      activityCount: json['activityCount'],
      passwordSalt: json['passwordSalt'],
      avatarUrl: json['avatarUrl'],
      gender: json['gender'],
      bio: json['bio'],
      birthday: json['birthday'],
      lastLoginTime: json['lastLoginTime'],
      createdAt: json['createdAt'],
    );
  }

  // 将对象转为JSON
  Map<String, dynamic> toJson() {
    return {
      'username': username,
      'email': email,
      'phone': phone,
      'address': address,
      'points': points,
      'articleCount': articleCount,
      'activityCount': activityCount,
      'passwordSalt': passwordSalt,
      'avatarUrl': avatarUrl,
      'gender': gender,
      'bio': bio,
      'birthday': birthday,
      'lastLoginTime': lastLoginTime,
      'createdAt': createdAt,
    };
  }
}
```

