var ConversationFactory = {
    create: function () {
        var conversationInstance = {
            token: null,
            conversations: [],
            currentUpdateConversationId: 0,
            currentUpdateReplyConversationId: 0,
            currentReplyToId: 0,
            currentReplyToReplyId: 0,
            userId:0,
            init: function () {
                var self = this;
                //self.getConversations(self.token);
            },
            getConversations: function (token) {
                var self = this;
                self.token = token;
                self.conversations.splice(0, self.conversations.length);
                $.ajax({
                    url: "/tables/Conversations?$filter=Token eq '{0}'&$expand=User,ReplyConversations($select=Id)&$orderby=Id desc".format(token),
                    method: "get",
                    success: function (data) {
                        $.each(data.value, function (a, b) {
                            b.CreateTime = getFormatedDate(b.CreateTime);
                            b.Replies = [];
                            self.conversations.push(b);
                        });
                    },
                    error: function (error) {
                        console.log(error);
                    },
                    complete: function () {
                    },
                    contentType: "application/json; charset=utf-8",
                    dataType: "json"
                });
            },
            editPost: function (id) {
                var self = this;
                self.currentUpdateConversationId = id;
            },
            editReplyPost: function (id) {
                var self = this;
                self.currentUpdateReplyConversationId = id;
            },
            getReplyConversations: function (id) {
                var self = this;
                $.ajax({
                    url: "/tables/ReplyConversations?$filter=ReplyId eq {0}&$expand=User&$orderby=Id desc".format(id),
                    method: "get",
                    success: function (data) {
                        var conversation = null;
                        $.each(self.conversations, function (a, b) {
                            if (b.Id == id) {
                                conversation = b;
                                return false;
                            }
                        });
                        if (conversation) {
                            $.each(data.value, function (a, b) {
                                b.CreateTime = getFormatedDate(b.CreateTime);
                                conversation.Replies.push(b);
                            });
                        }
                    },
                    error: function (error) {
                    },
                    complete: function () {
                    },
                    contentType: "application/json; charset=utf-8",
                    dataType: "json"
                });
            },
            getReplyConversation: function (id, replyId) {
                var self = this;
                $.ajax({
                    url: "/tables/ReplyConversations({0})?$expand=User".format(id),
                    method: "get",
                    success: function (data) {
                        var conversation = null;
                        $.each(self.conversations, function (a, b) {
                            if (b.Id == replyId) {
                                conversation = b;
                                return false;
                            }
                        });
                        if (conversation) {
                            conversation.Replies.unshift(data);
                        }
                    },
                    error: function (error) {
                        console.log(error);
                    },
                    complete: function () {
                    },
                    contentType: "application/json; charset=utf-8",
                    dataType: "json"
                });
            },
            getConversation: function (id) {
                var self = this;
                $.ajax({
                    url: "/tables/Conversations({0})?$expand=User,ReplyConversations($select=Id)".format(id),
                    method: "get",
                    success: function (data) {
                        data.Replies = [];
                        self.conversations.unshift(data);
                    },
                    error: function (error) {
                        console.log(error);
                    },
                    complete: function () {
                    },
                    contentType: "application/json; charset=utf-8",
                    dataType: "json"
                });
            },
            post: function (text, userId) {
                var self = this;
                var inputData = {
                    Content: text,
                    CreateTime: new Date().toISOString(),
                    CreateBy: userId,
                    Token: self.token
                };
                return $.ajax({
                    url: "/tables/Conversations",
                    method: "post",
                    data: JSON.stringify(inputData),
                    success: function (data) {
                        self.getConversation(data.Id);
                    },
                    error: function (error) {
                        console.log(error);
                    },
                    complete: function () {
                    },
                    contentType: "application/json; charset=utf-8",
                    dataType: "json"
                });
            },
            deletePost: function (id) {
                var self = this;
                $.ajax({
                    url: "/tables/Conversations({0})".format(id),
                    method: "delete",
                    success: function (data) {
                        $.each(self.conversations, function (a, b) {
                            if (b.Id === id) {
                                self.conversations.splice(a, 1);
                                return false;
                            }
                        });
                    },
                    error: function (error) {
                        console.log(error);
                    },
                    complete: function () {
                    },
                    contentType: "application/json; charset=utf-8",
                    dataType: "json"
                });
            },
            updatePost: function (id) {
                var self = this;
                var inputData = {
                    Content: $("#grouppage_edit_conversation_text{0}".format(id)).text()
                };
                $.ajax({
                    url: "/tables/Conversations({0})".format(id),
                    method: "patch",
                    data: JSON.stringify(inputData),
                    success: function (data) {
                        $.each(self.conversations, function (a, b) {
                            if (b.Id === id) {
                                b.Content = inputData.Content;
                                return false;
                            }
                        });
                        self.cancelEditPost();
                    },
                    error: function (error) {
                    },
                    complete: function () {
                    },
                    contentType: "application/json; charset=utf-8",
                    dataType: "json"
                });
            },
            updateReplyPost: function (id, conversationId) {
                var self = this;
                var inputData = {
                    Content: $("#grouppage_edit_reply_conversation_text{0}".format(id)).text(),
                };
                $.ajax({
                    url: "/tables/ReplyConversations({0})".format(id),
                    method: "patch",
                    data: JSON.stringify(inputData),
                    success: function (data) {
                        $.each(self.conversations, function (a, b) {
                            if (b.Id === conversationId) {
                                $.each(b.Replies, function (c, d) {
                                    if (d.Id === id) {
                                        d.Content = inputData.Content;
                                        return false;
                                    }
                                });
                                return false;
                            }
                        });
                        self.currentUpdateReplyConversationId = 0;
                    },
                    error: function (error) {
                        console.log(error);
                    },
                    complete: function () {
                    },
                    contentType: "application/json; charset=utf-8",
                    dataType: "json"
                });
            },
            submitReply: function () {
                var self = this;
                var text = $("#reply-conversation-text-{0}".format(self.currentReplyToId)).text();
                var inputData = {
                    Content: text,
                    ReplyId: self.currentReplyToId,
                    CreateTime: new Date().toISOString(),
                    CreateBy: self.userId
                };
                $.ajax({
                    url: "/tables/ReplyConversations",
                    method: "post",
                    data: JSON.stringify(inputData),
                    success: function (data) {
                        self.getReplyConversation(data.Id, data.ReplyId);
                        self.currentReplyToId = 0;
                    },
                    error: function (error) {
                    },
                    complete: function () {
                    },
                    contentType: "application/json; charset=utf-8",
                    dataType: "json"
                });
            },
            submitReplyReply: function (id) {
                var self = this;
                var inputData = {
                    Content: $("#reply-reply-conversation-text-{0}".format(self.currentReplyToReplyId)).text(),
                    ReplyId: id,
                    CreateTime: new Date().toISOString(),
                    CreateBy: self.userId
                };
                $.ajax({
                    url: "/tables/ReplyConversations",
                    method: "post",
                    data: JSON.stringify(inputData),
                    success: function (data) {
                        self.getReplyConversation(data.Id, data.ReplyId);
                        self.currentReplyToReplyId = 0;
                    },
                    error: function (error) {
                        console.log(error);
                    },
                    complete: function () {
                    },
                    contentType: "application/json; charset=utf-8",
                    dataType: "json"
                });
            },
            toggleReplyConversationSubMenu: function (id) {
                var self = this;
                if ($("#reply-sub-menu-{0}".format(id)).is(":visible")) {
                    $("#reply-sub-menu-{0}".format(id)).hide();
                }
                else {
                    $("#reply-sub-menu-{0}".format(id)).show();
                    main.common.menuMask.show = true;
                    $(".menu-mask").click(function () {
                        $("#reply-sub-menu-{0}".format(id)).hide();
                        main.common.menuMask.show = false;
                        $(".menu-mask").unbind("click");
                    });
                }
            },
            toggleConversationSubMenu: function (id) {
                var self = this;
                if ($("#sub-menu-{0}".format(id)).is(":visible")) {
                    $("#sub-menu-{0}".format(id)).hide();
                }
                else {
                    $("#sub-menu-{0}".format(id)).show();
                    main.common.menuMask.show = true;
                    $(".menu-mask").click(function () {
                        $("#sub-menu-{0}".format(id)).hide();
                        main.common.menuMask.show = false;
                        $(".menu-mask").unbind("click");
                    });
                }
            },
            cancelEditPost: function () {
                var self = this;
                self.currentUpdateConversationId = 0;
            },
            cancelEditReplyPost: function () {
                var self = this;
                self.currentUpdateReplyConversationId = 0;
            },
            deleteReplyPost: function (id, conversationId) {
                var self = this;
                $.ajax({
                    url: "/tables/ReplyConversations({0})".format(id),
                    method: "delete",
                    success: function (data) {
                        var conversation = null;
                        $.each(self.conversations, function (a, b) {
                            if (b.Id === conversationId) {
                                conversation = b;
                                return false;
                            }
                        });
                        if (conversation) {
                            $.each(conversation.Replies, function (a, b) {
                                if (b.Id == id) {
                                    conversation.Replies.splice(a, 1);
                                    return false;
                                }
                            });
                        }
                    },
                    error: function (error) {
                        console.log(error);
                    },
                    complete: function () {
                    },
                    contentType: "application/json; charset=utf-8",
                    dataType: "json"
                });
            }
        };
        conversationInstance.init();
        return conversationInstance;
    }
};

Vue.component('conversation', {
    props: ['conversations','user'],
    template:
        '<div>' +
        '<div class="input-box">' +
        '    <div class="input-box-label">回复</div>' +
        '    <input type="text" />' +
        '</div>' +
        '<div>' +
        '    <a href="javascript:void(0)" class="btn btn-pri" v-on:click="">发送</a>' +
        '</div>' +
        '<div class="conversation-items" v-for="item in conversations.getCore().conversations">' +
        '    <div class="conversation-item" v-if="conversations.getCore().currentUpdateConversationId!=item.Id">' +
        '        <div class="conversation-item-user-image" >' +
        '            <img v-bind:src="item.User.Image" />' +
        '        </div>' +
        '        <div class="conversation-item-detail">' +
        '            <div class="conversation-item-detail-user-and-time">' +
        '                <span class="conversation-item-detail-user-name">{{item.User.Name}}</span> <span class="conversation-item-detail-time">{{item.CreateTime}}</span>' +
        '            </div>' +
        '            <div class="conversation-item-detail-text">' +
        '                <span>{{item.Content}}</span>' +
        '            </div>' +
        '            <div class="conversation-item-functions">' +
        '                <div class="conversation-item-reply-btn" v-on:click="conversations.getCore().currentReplyToId=item.Id">回复</div>' +
        '                <div class="conversation-item-reply-count">' +
        '                    <a href="javascript:void(0)" v-on:click="conversations.getCore().getReplyConversations(item.Id)"><span>{{item.ReplyConversations.length}} 回复</span></a>' +
        '                </div>' +
        '                <div class="conversation-item-menu">' +
        '                    <span class="fas fa-ellipsis-v conversation-item-menu-icon" v-on:click="conversations.getCore().toggleConversationSubMenu(item.Id)"></span>' +
        '                    <div class="sub-menu popup-menu hide" v-bind:id="\'sub-menu-\'+item.Id">' +
        '                        <div class="sub-menu-item">' +
        '                            <a href="javascript:void(0)" v-on:click="conversations.getCore().editPost(item.Id)"><i class="fas fa-edit"></i><span>编辑</span></a>' +
        '                        </div>' +
        '                        <div class="sub-menu-item">' +
        '                            <a href="javascript:void(0)" v-on:click="conversations.getCore().deletePost(item.Id)"><i class="fas fa-times"></i><span>删除</span></a>' +
        '                        </div>' +
        '                    </div>' +
        '                </div>' +
        '            </div>' +
        '            <div class="conversation-item-replies">' +
        '                <div v-if="conversations.getCore().currentReplyToId==item.Id">' +
        '                    <div class="input-box">' +
        '                        <div class="input-box-label"><span></span>回复</div>' +
        '                        <textarea autogrow="true" row="5" v-bind:id="\'reply-conversation-text-\'+item.Id" placeholder="回复内容..."></textarea>'+
        '                    </div>' +
        '                    <div class="conversation-item-functions">' +
        '                        <div class="conversation-item-reply-btn" v-on:click="conversations.getCore().currentReplyToId=0">取消</div>' +
        '                        <div class="conversation-item-reply-btn" v-on:click="conversations.getCore().submitReply()">回复</div>' +
        '                    </div>' +
        '                </div>' +
        '                <div v-for="reply in item.Replies">' +
        '                    <div class="conversation-item" v-if="conversations.getCore().currentUpdateReplyConversationId!=reply.Id">' +
        '                        <div class="conversation-item-user-image">' +
        '                            <img v-bind:src="reply.User.Image" />' +
        '                        </div>' +
        '                        <div class="conversation-item-detail">' +
        '                            <div class="conversation-item-detail-user-and-time">' +
        '                                <span class="conversation-item-detail-user-name">{{reply.User.Name}}</span><span class="conversation-item-detail-time">{{reply.CreateTime}}</span>' +
        '                            </div>' +
        '                            <div class="conversation-item-detail-text">' +
        '                                <span>{{reply.Content}}</span>' +
        '                            </div>' +
        '                            <div class="conversation-item-functions">' +
        '                                <div class="conversation-item-reply-btn" v-on:click="conversations.getCore().currentReplyToReplyId=reply.Id">回复</div>' +
        '                                <div class="conversation-item-menu">' +
        '                                    <span class="fas fa-ellipsis-v conversation-item-menu-icon" v-on:click="conversations.getCore().toggleReplyConversationSubMenu(reply.Id)"></span>' +
        '                                    <div class="sub-menu popup-menu hide" v-bind:id="\'reply-sub-menu-\'+reply.Id">' +
        '                                        <div class="sub-menu-item">' +
        '                                            <a href="javascript:void(0)" v-on:click="conversations.getCore().editReplyPost(reply.Id)"><i class="fas fa-edit"></i><span>编辑</span></a>' +
        '                                        </div>' +
        '                                        <div class="sub-menu-item">' +
        '                                            <a href="javascript:void(0)" v-on:click="conversations.getCore().deleteReplyPost(reply.Id, item.Id)"><i class="fas fa-times"></i><span>删除</span></a>' +
        '                                        </div>' +
        '                                    </div>' +
        '                                </div>' +
        '                            </div>' +
        '                        </div>' +
        '                    </div>' +
        '                    <div v-if="conversations.getCore().currentReplyToReplyId==reply.Id" class="conversation-item">' +
        '                        <div class="conversation-item-user-image" >' +
        '                            <img v-bind:src="user.Image" />' +
        '                        </div>' +
        '                        <div class="conversation-item-detail">' +
        '                            <div class="input-box">' +
        '                                <div class="input-box-label"><span></span>回复</div>' +
        '                                <textarea autogrow="true" row="5" v-bind:id="\'reply-reply-conversation-text-\'+reply.Id" placeholder="回复内容..."></textarea>' +
        '                            </div>' +
        '                            <div class="conversation-item-functions">' +
        '                                <div class="conversation-item-reply-btn" v-on:click="conversations.getCore().currentReplyToReplyId=0">取消</div>' +
        '                                <div class="conversation-item-reply-btn" v-on:click="conversations.getCore().submitReplyReply(item.Id)">回复</div>' +
        '                            </div>' +
        '                        </div>' +
        '                    </div>' +
        '                    <div v-if="conversations.getCore().currentUpdateReplyConversationId==reply.Id" class="conversation-item">' +
        '                        <div class="conversation-item-user-image" >' +
        '                            <img v-bind:src="user.Image" />' +
        '                        </div>' +
        '                        <div class="conversation-item-detail">' +
        '                            <div class="input-box">' +
        '                                <div class="input-box-label"><span></span>更新</div>' +
        '                                <textarea autogrow="true" row="5" v-bind:id="\'grouppage_edit_reply_conversation_text\'+reply.Id" placeholder="更新内容...">{{reply.Content}}</textarea>' +
        '                            </div>' +
        '                            <div class="conversation-item-functions">' +
        '                                <div class="conversation-item-reply-btn" v-on:click="conversations.getCore().cancelEditReplyPost(reply.Id)">取消</div>' +
        '                                <div class="conversation-item-reply-btn" v-on:click="conversations.getCore().updateReplyPost(reply.Id, item.Id)">更新</div>' +
        '                            </div>' +
        '                        </div>' +
        '                    </div>' +
        '                </div>' +
        '            </div>' +
        '        </div>' +
        '    </div>' +
        '    <div v-if="conversations.getCore().currentUpdateConversationId==item.Id" class="conversation-item">' +
        '        <div class="conversation-item-user-image" >' +
        '            <img v-bind:src="user.Image" />' +
        '        </div>' +
        '        <div class="conversation-item-detail">' +
        '            <div class="input-box">' +
        '                <div class="input-box-label"><span></span>更新</div>' +
        '                <textarea autogrow="true" row="5" v-bind:id="\'grouppage_edit_conversation_text\'+item.Id" placeholder="更新内容...">{{item.Content}}</textarea>' +
        '            </div>' +
        '            <div class="conversation-item-functions">' +
        '                <div class="conversation-item-reply-btn" v-on:click="conversations.getCore().cancelEditPost(item.Id)">取消</div>' +
        '                <div class="conversation-item-reply-btn" v-on:click="conversations.getCore().updatePost(item.Id)">更新</div>' +
        '            </div>' +
        '        </div>' +
        '    </div>' +
        '</div>' +
        '</div>'
});