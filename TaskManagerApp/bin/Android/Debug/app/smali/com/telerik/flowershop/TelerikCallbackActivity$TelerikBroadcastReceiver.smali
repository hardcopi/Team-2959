.class Lcom/telerik/flowershop/TelerikCallbackActivity$TelerikBroadcastReceiver;
.super Landroid/content/BroadcastReceiver;
.source "TelerikCallbackActivity.java"


# annotations
.annotation system Ldalvik/annotation/EnclosingClass;
    value = Lcom/telerik/flowershop/TelerikCallbackActivity;
.end annotation

.annotation system Ldalvik/annotation/InnerClass;
    accessFlags = 0x2
    name = "TelerikBroadcastReceiver"
.end annotation


# instance fields
.field final synthetic this$0:Lcom/telerik/flowershop/TelerikCallbackActivity;


# direct methods
.method private constructor <init>(Lcom/telerik/flowershop/TelerikCallbackActivity;)V
    .locals 0
    .parameter

    .prologue
    .line 124
    iput-object p1, p0, Lcom/telerik/flowershop/TelerikCallbackActivity$TelerikBroadcastReceiver;->this$0:Lcom/telerik/flowershop/TelerikCallbackActivity;

    invoke-direct {p0}, Landroid/content/BroadcastReceiver;-><init>()V

    return-void
.end method

.method synthetic constructor <init>(Lcom/telerik/flowershop/TelerikCallbackActivity;Lcom/telerik/flowershop/TelerikCallbackActivity$TelerikBroadcastReceiver;)V
    .locals 0
    .parameter
    .parameter

    .prologue
    .line 124
    invoke-direct {p0, p1}, Lcom/telerik/flowershop/TelerikCallbackActivity$TelerikBroadcastReceiver;-><init>(Lcom/telerik/flowershop/TelerikCallbackActivity;)V

    return-void
.end method


# virtual methods
.method public onReceive(Landroid/content/Context;Landroid/content/Intent;)V
    .locals 2
    .parameter "context"
    .parameter "intent"

    .prologue
    .line 128
    invoke-virtual {p2}, Landroid/content/Intent;->getAction()Ljava/lang/String;

    move-result-object v0

    const-string v1, "com.telerik.RefreshWebView"

    invoke-virtual {v0, v1}, Ljava/lang/String;->equalsIgnoreCase(Ljava/lang/String;)Z

    move-result v0

    if-eqz v0, :cond_0

    .line 129
    iget-object v0, p0, Lcom/telerik/flowershop/TelerikCallbackActivity$TelerikBroadcastReceiver;->this$0:Lcom/telerik/flowershop/TelerikCallbackActivity;

    invoke-virtual {v0}, Lcom/telerik/flowershop/TelerikCallbackActivity;->RefreshWebView()V

    .line 131
    iget-object v0, p0, Lcom/telerik/flowershop/TelerikCallbackActivity$TelerikBroadcastReceiver;->this$0:Lcom/telerik/flowershop/TelerikCallbackActivity;

    #calls: Lcom/telerik/flowershop/TelerikCallbackActivity;->liveSyncFeedback()V
    invoke-static {v0}, Lcom/telerik/flowershop/TelerikCallbackActivity;->access$0(Lcom/telerik/flowershop/TelerikCallbackActivity;)V

    .line 133
    :cond_0
    return-void
.end method
