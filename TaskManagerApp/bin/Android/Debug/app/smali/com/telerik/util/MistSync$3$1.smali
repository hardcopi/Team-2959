.class Lcom/telerik/util/MistSync$3$1;
.super Ljava/lang/Object;
.source "MistSync.java"

# interfaces
.implements Landroid/content/DialogInterface$OnClickListener;


# annotations
.annotation system Ldalvik/annotation/EnclosingMethod;
    value = Lcom/telerik/util/MistSync$3;->run()V
.end annotation

.annotation system Ldalvik/annotation/InnerClass;
    accessFlags = 0x0
    name = null
.end annotation


# instance fields
.field final synthetic this$1:Lcom/telerik/util/MistSync$3;


# direct methods
.method constructor <init>(Lcom/telerik/util/MistSync$3;)V
    .locals 0
    .parameter

    .prologue
    .line 1
    iput-object p1, p0, Lcom/telerik/util/MistSync$3$1;->this$1:Lcom/telerik/util/MistSync$3;

    .line 135
    invoke-direct {p0}, Ljava/lang/Object;-><init>()V

    return-void
.end method


# virtual methods
.method public onClick(Landroid/content/DialogInterface;I)V
    .locals 0
    .parameter "arg0"
    .parameter "arg1"

    .prologue
    .line 137
    invoke-interface {p1}, Landroid/content/DialogInterface;->dismiss()V

    .line 138
    return-void
.end method
