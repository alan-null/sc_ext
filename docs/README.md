# Sitecore Extensions documentation

## Local preview with Docker

From repository root:

```bash
docker run --rm -it \
  -p 4000:4000 \
  -v "$PWD/docs:/srv/jekyll" \
  -w /srv/jekyll \
  ruby:3.2-bookworm \
  sh -lc 'bundle install && bundle exec jekyll serve --host 0.0.0.0 --watch --baseurl ""'
```

Open <http://localhost:4000/>.

Use the root URL exactly as shown. `/sc_ext` is the GitHub Pages base path and
is not used by the local Docker preview.
