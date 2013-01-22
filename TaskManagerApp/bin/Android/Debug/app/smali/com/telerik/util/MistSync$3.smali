.class Lcom/telerik/util/MistSync$3;
.super Ljava/lang/Object;
.source "MistSync.java"

# interfaces
.implements Ljava/lang/Runnable;


# annotations
.annotation system Ldalvik/annotation/EnclosingMethod;
    value = Lcom/telerik/util/MistSync;->updateFiles()Z
.end annotation

.annotation system Ldalvik/annotation/InnerClass;
    accessFlags = 0x0
    name = null
.end annotation


# instance fields
.field final synthetic this$0:Lcom/telerik/util/MistSync;

.field private final synthetic val$ioe:Ljava/io/IOException;


# direct methods
.method constructor <init>(Lcom/telerik/util/MistSync;Ljava/io/IOException;)V
    .locals 0
    .parameter
    .parameter

    .prologue
    .line 1
    iput-object p1, p0, Lcom/telerik/util/MistSync$3;->this$0:Lcom/telerik/util/MistSync;

    iput-object p2, p0, Lcom/telerik/util/MistSync$3;->val$ioe:Ljava/io/IOException;

    .line 129
    invoke-direct {p0}, Ljava/lang/Object;-><init>()V

    return-void
.end method


# virtual methods
.method public run()V
    .locals 4

    .prologue
    .line 131
    new-instance v1, Landroid/app/AlertDialog$Builder;

    iget-object v2, p0, Lcom/telerik/util/MistSync$3;->this$0:Lcom/telerik/util/MistSync;

    #getter for: Lcom/telerik/util/MistSync;->context:Landroid/app/Activity;
    invoke-static {v2}, Lcom/telerik/util/MistSync;->access$1(Lcom/telerik/util/MistSync;)Landroid/app/Activity;

    move-result-object v2

    invoke-direct {v1, v2}, Landroid/app/AlertDialog$Builder;-><init>(Landroid/content/Context;)V

    .line 132
    const/4 v2, 0x0

    invoke-virtual {v1, v2}, Landroid/app/AlertDialog$Builder;->setCancelable(Z)Landroid/app/AlertDialog$Builder;

    move-result-object v1

    .line 133
    const-string v2, "Error"

    invoke-virtual {v1, v2}, Landroid/app/AlertDialog$Builder;->setTitle(Ljava/lang/CharSequence;)Landroid/app/AlertDialog$Builder;

    move-result-object v1

    .line 134
    iget-object v2, p0, Lcom/telerik/util/MistSync$3;->val$ioe:Ljava/io/IOException;

    invoke-virtual {v2}, Ljava/io/IOException;->getMessage()Ljava/lang/String;

    move-result-object v2

    invoke-virtual {v1, v2}, Landroid/app/AlertDialog$Builder;->setMessage(Ljava/lang/CharSequence;)Landroid/app/AlertDialog$Builder;

    move-result-object v1

    .line 135
    const-string v2, "OK"

    new-instance v3, Lcom/telerik/util/MistSync$3$1;

    invoke-direct {v3, p0}, Lcom/telerik/util/MistSync$3$1;-><init>(Lcom/telerik/util/MistSync$3;)V

    invoke-virtual {v1, v2, v3}, Landroid/app/AlertDialog$Builder;->setNeutralButton(Ljava/lang/CharSequence;Landroid/content/DialogInterface$OnClickListener;)Landroid/app/AlertDialog$Builder;

    move-result-object v1

    .line 140
    invoke-virtual {v1}, Landroid/app/AlertDialog$Builder;->create()Landroid/app/AlertDialog;

    move-result-object v0

    .line 141
    .local v0, dialog:Landroid/app/AlertDialog;
    invoke-virtual {v0}, Landroid/app/AlertDialog;->show()V

    .line 142
    return-void
.end method
