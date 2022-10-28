export class VkOauthDto {
  response: [
    {
      id: number;
      sex: 1 | 2;
      photo_100: string;
      first_name: string;
      last_name: string;
      can_access_closed: boolean;
      is_closed: boolean;
    },
  ];
}
