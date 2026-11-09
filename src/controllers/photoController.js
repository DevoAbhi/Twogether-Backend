import { Photo } from '../models/Photo.js';
import { HttpError } from '../utils/HttpError.js';

export async function getPhoto(req, res) {
  const photo = await Photo.findById(req.params.id);
  if (!photo) throw new HttpError(404, 'Photo not found');

  res.type(photo.mime);
  res.set('Cache-Control', 'private, max-age=86400');
  res.send(photo.data);
}
