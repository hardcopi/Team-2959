.class Lcom/telerik/flowershop/TelerikCallbackActivity$1$1;
.super Ljava/lang/Object;
.source "TelerikCallbackActivity.java"

# interfaces
.implements Ljava/lang/Runnable;


# annotations
.annotation system Ldalvik/annotation/EnclosingMethod;
    value = Lcom/telerik/flowershop/TelerikCallbackActivity$1;->run()V
.end annotation

.annotation system Ldalvik/annotation/InnerClass;
    accessFlags = 0x0
    name = null
.end annotation


# instance fields
.field final synthetic this$1:Lcom/telerik/flowershop/TelerikCallbackActivity$1;

.field private final synthetic val$view:Landroid/view/View;


# direct methods
.method constructor <init>(Lcom/telerik/flowershop/TelerikCallbackActivity$1;Landroid/view/View;)V
    .locals 0
    .parameter
    .parameter

    .prologue
    .line 1
    iput-object p1, p0, Lcom/telerik/flowershop/TelerikCallbackActivity$1$1;->this$1:Lcom/telerik/flowershop/TelerikCallbackActivity$1;

    iput-object p2, p0, Lcom/telerik/flowershop/TelerikCallbackActivity$1$1;->val$view:Landroid/view/View;

    .line 107
    invoke-direct {p0}, Ljava/lang/Object;-><init>()V

    return-void
.end method


# virtual methods
.method public run()V
    .locals 2

    .prologue
    .line 109
    iget-object v0, p0, Lcom/telerik/flowershop/TelerikCallbackActivity$1$1;->this$1:Lcom/telerik/flowershop/TelerikCallbackActivity$1;

    #getter for: Lcom/telerik/flowershop/TelerikCallbackActivity$1;->this$0:Lcom/telerik/flowershop/TelerikCallbackActivity;
    invoke-static {v0}, Lcom/telerik/flowershop/TelerikCallbackActivity$1;->access$0(Lcom/telerik/flowershop/TelerikCallbackActivity$1;)Lcom/telerik/flowershop/TelerikCallbackActivity;

    move-result-object v0

    #getter for: Lcom/telerik/flowershop/TelerikCallbackActivity;->root:Landroid/widget/LinearLayout;
    invoke-static {v0}, Lcom/telerik/flowershop/TelerikCallbackActivity;->access$1(Lcom/telerik/flowershop/TelerikCallbackActivity;)Landroid/widget/LinearLayout;

    move-result-object v0

    iget-object v1, p0, Lcom/telerik/flowershop/TelerikCallbackActivity$1$1;->val$view:Landroid/view/View;

    invoke-virtual {v0, v1}, Landroid/widget/LinearLayout;->removeView(Landroid/view/View;)V

    .line 110
    return-void
.end method
