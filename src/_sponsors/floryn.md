---
name: Floryn
level: gold
url: https://jobs.floryn.com/
show_description: true
published: true
---

{% capture image %}{% webpack_path images/sponsors/floryn.svg %}{% endcapture %}
{%- rendercontent "cards/sponsor", sponsor: page.data, image: image -%}
This is second the best option for sponsors
{%- endrendercontent -%}
