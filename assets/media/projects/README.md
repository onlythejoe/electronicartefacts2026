# Project media folders

Store project-specific assets in one folder per project slug.

Convention:
- `assets/media/projects/<project-id>/...`

The project detail template renders only the media declared on the project entry, so assets stay local to each project.
Gallery entries can be images or videos. Use a `mediaType` field of `video` when a project needs to point at a movie file.
