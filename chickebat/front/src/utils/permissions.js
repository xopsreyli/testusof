const permissions = {
  admin: [
    'update:user',
    'view:userOwnProfile',
    'view:settings',
    'view:favorites',
    'view:postStatus',
    'view:edit',
    'create:post',
    'update:post',
  ],
  user: [
    'update:user',
    'view:userOwnProfile',
    'view:settings',
    'view:favorites',
    'view:postStatus',
    'view:edit',
    'create:post',
    'update:post',
  ]
}

const hasPermission = (user, permission, targetId = null) => {
  return permissions[user?.role]?.includes(permission) &&
  targetId ? user.id === targetId : true
}

export default hasPermission