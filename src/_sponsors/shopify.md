---
name: Company Name
level: ruby
url: https://smrtr.io/bsVsV
show_description: true
published: true
---

{% capture image %}{% webpack_path images/sponsors/shopify.svg %}{% endcapture %}
{%- rendercontent "cards/sponsor", sponsor: page.data, image: image -%}
This is the best sponsorhip option you can have
{%- endrendercontent -%}
