self.__BUILD_MANIFEST = {
  "polyfillFiles": [
    "static/chunks/polyfills.js"
  ],
  "devFiles": [
    "static/chunks/react-refresh.js"
  ],
  "ampDevFiles": [],
  "lowPriorityFiles": [],
  "rootMainFiles": [],
  "pages": {
    "/": [
      "static/chunks/webpack.js",
      "static/chunks/main.js",
      "static/chunks/pages/index.js"
    ],
    "/_app": [
      "static/chunks/webpack.js",
      "static/chunks/main.js",
      "static/chunks/pages/_app.js"
    ],
    "/_error": [
      "static/chunks/webpack.js",
      "static/chunks/main.js",
      "static/chunks/pages/_error.js"
    ],
    "/basic_info": [
      "static/chunks/webpack.js",
      "static/chunks/main.js",
      "static/chunks/pages/basic_info.js"
    ],
    "/education": [
      "static/chunks/webpack.js",
      "static/chunks/main.js",
      "static/chunks/pages/education.js"
    ],
    "/project-experience": [
      "static/chunks/webpack.js",
      "static/chunks/main.js",
      "static/chunks/pages/project-experience.js"
    ],
    "/skills": [
      "static/chunks/webpack.js",
      "static/chunks/main.js",
      "static/chunks/pages/skills.js"
    ],
    "/work-experience": [
      "static/chunks/webpack.js",
      "static/chunks/main.js",
      "static/chunks/pages/work-experience.js"
    ]
  },
  "ampFirstPages": []
};
self.__BUILD_MANIFEST.lowPriorityFiles = [
"/static/" + process.env.__NEXT_BUILD_ID + "/_buildManifest.js",
,"/static/" + process.env.__NEXT_BUILD_ID + "/_ssgManifest.js",

];