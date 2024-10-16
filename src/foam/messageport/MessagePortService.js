/**
 * @license
 * Copyright 2016 Google Inc. All Rights Reserved.
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
  package: 'foam.messageport',
  name: 'MessagePortService',

  requires: [
    'foam.box.NamedBox',
    'foam.box.RawMessagePortBox',
    'foam.box.RegisterSelfMessage',
    'foam.json.Parser'
  ],

  imports: [
    'creationContext'
  ],

  topics: [ 'connect' ],

  properties: [
    {
      name: 'source',
      postSet: function() {
        this.source.addEventListener('connect', this.onConnect);
        this.source.addEventListener('message', this.onConnect);
      }
    },
    {
      name: 'delegate',
      required: true
    },
    {
      class: 'FObjectProperty',
      of: 'foam.json.Parser',
      name: 'parser',
      factory: function() {
        // NOTE: Configuration must be consistent with outputters in
        // foam.box.MessagePortBox and foam.box.RawMesagePortBox.
        return this.Parser.create({
          strict: true,
          creationContext: this.creationContext
        });
      }
    }
  ],

  methods: [
    function addPort(p) {
      p.onmessage = this.onMessage.bind(this, p);
    }
  ],

  listeners: [
    function onConnect(e) {
      for ( var i = 0 ; i < e.ports.length ; i++ ) {
        this.addPort(e.ports[i]);
      }
    },

    function onMessage(port, e) {
      var msg = this.parser.parseString(e.data);

      if ( this.RegisterSelfMessage.isInstance(msg.object) ) {
        var named = this.NamedBox.create({ name: msg.object.name });
        named.delegate = this.RawMessagePortBox.create({
          port: port
        });
        this.connect.pub(named);
        return;
      }

      this.delegate && this.delegate.send(msg);
    }
  ]
});
