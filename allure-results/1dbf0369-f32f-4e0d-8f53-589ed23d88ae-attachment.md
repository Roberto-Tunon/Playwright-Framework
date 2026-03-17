# Page snapshot

```yaml
- generic [ref=e2]:
  - generic [ref=e3]:
    - banner [ref=e4]:
      - generic [ref=e7]:
        - button "Změnit navigaci" [ref=e8] [cursor=pointer]:
          - generic [ref=e9] [cursor=pointer]: Menu
        - link "XXXLutz" [ref=e10] [cursor=pointer]:
          - /url: /
          - generic [ref=e11] [cursor=pointer]: XXXLutz
          - img [ref=e13] [cursor=pointer]
        - link "K hlavnímu obsahu" [ref=e19] [cursor=pointer]:
          - /url: "#main"
        - search [ref=e20]:
          - generic [ref=e21]:
            - button "Hledat" [ref=e23] [cursor=pointer]
            - searchbox "Hledat produkty, značky nebo novinky" [ref=e24]
            - generic: Hledat produkty, značky nebo novinky
            - button "Vyhledávání dle obrázků" [ref=e28] [cursor=pointer]
        - generic [ref=e29]:
          - button "Přihlásit se" [ref=e31] [cursor=pointer]:
            - generic [ref=e32] [cursor=pointer]: Přihlásit se
          - link "Oblíbené 0 produkty" [ref=e34] [cursor=pointer]:
            - /url: /favourites
            - generic [ref=e35] [cursor=pointer]: Seznam oblíbených
          - link "Můj nákupní košík 0 produkty" [ref=e37] [cursor=pointer]:
            - /url: /cart
            - generic [ref=e38] [cursor=pointer]: Košík
        - navigation [ref=e39]:
          - list [ref=e40]
    - main [ref=e41]:
      - status [ref=e42]
      - heading "O tomto výrobku" [level=2] [ref=e54]
  - contentinfo
```