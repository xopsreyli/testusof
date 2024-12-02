import fetchRequest from '../../../fetchRequest.js'

const updatePostAction = async ({params, request}) => {
  const formData = await request.formData()

  const originalCategories = formData.get('originalCategories').split(',')
  const updatedCategories = formData.get('updatedCategories').split(',')

  let categoriesToDelete = originalCategories.filter(c => !updatedCategories.includes(c))
  let categoriesToAdd = updatedCategories.filter(c => !originalCategories.includes(c))

  return fetchRequest(
    `/api/post/${params.id}`,
    {
      method: 'PATCH',
      body: JSON.stringify({
        title: formData.get('title'),
        content: formData.get('content'),
        isActive: formData.get('status'),
        categoriesToDelete: categoriesToDelete,
        categoriesToAdd: categoriesToAdd,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    },
    true,
  )
}

export default updatePostAction