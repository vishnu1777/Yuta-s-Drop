export default {
  name: 'collection',
  title: 'Collection',
  type: 'document',
  fields: [
    {
      name: 'title',
      description: 'Enter the title of Nft drop',
      type: 'string',
      title: 'Title',
    },
    {
      name: 'description',
      title: 'Description',
      type: 'string',
    },
    {
      name: 'nameOfNft',
      title: 'Name Of Nft',
      type: 'string',
    },
    {
      name: 'address',
      title: 'Address',
      type: 'string',
    },
    {
      name: 'slug',
      type: 'slug',
      title: 'Slug',
      options: {
        source: 'title',
      },
    },
    {
      name: 'creator',
      title: 'Creator',
      type: 'reference',
      to: {type: 'creator'},
    },
    {
      name: 'mainImage',
      type: 'image',
      title: 'MainImage',
      options: {
        hotspot: true,
      },
    },
    {
      name: 'previewImage',
      type: 'image',
      title: 'PreviewImage',
      options: {
        hotspot: true,
      },
    },
  ],
}
