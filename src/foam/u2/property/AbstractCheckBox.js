/**
 * @license
 * Copyright 2015 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

foam.CLASS({
  package: 'foam.u2.property',
  name: 'AbstractCheckBox',
  extends: 'foam.u2.tag.Input',

  documentation: 'Abstract Checkbox View for other views to extend',

  css: `
    ^label {
      flex-grow: 1;
      margin-left: 12px;
      overflow: hidden;
      display: inline;
    }

    ^noselect {
      -webkit-touch-callout: none;
      -webkit-user-select: none;
      -khtml-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      user-select: none;
    }
  `,

  properties: [
    {
      class: 'Boolean',
      name: 'data'
    },
    {
      class: 'Boolean',
      name: 'showLabel',
      factory: function() { return this.label || this.labelFormatter },
    },
    {
      class: 'String',
      name: 'label'
    },
    {
      name: 'labelFormatter'
    }
  ],

  methods: [
    function updateMode_(mode) {
      var disabled = mode === foam.u2.DisplayMode.RO || mode === foam.u2.DisplayMode.DISABLED;
      this.setAttribute('disabled', disabled);
    },

    function link() {
      this.data$.linkTo(this.attrSlot('checked'));
    }
  ]
});
