.class public Lcom/telerik/util/BackgroundColorTransition;
.super Landroid/graphics/drawable/TransitionDrawable;
.source "BackgroundColorTransition.java"


# instance fields
.field private interval:I


# direct methods
.method public constructor <init>([Landroid/graphics/drawable/Drawable;)V
    .locals 1
    .parameter "layers"

    .prologue
    .line 10
    invoke-direct {p0, p1}, Landroid/graphics/drawable/TransitionDrawable;-><init>([Landroid/graphics/drawable/Drawable;)V

    .line 11
    const/16 v0, 0x1f4

    iput v0, p0, Lcom/telerik/util/BackgroundColorTransition;->interval:I

    .line 12
    invoke-direct {p0}, Lcom/telerik/util/BackgroundColorTransition;->initVars()V

    .line 13
    return-void
.end method

.method public constructor <init>([Landroid/graphics/drawable/Drawable;I)V
    .locals 0
    .parameter "layers"
    .parameter "interval"

    .prologue
    .line 15
    invoke-direct {p0, p1}, Landroid/graphics/drawable/TransitionDrawable;-><init>([Landroid/graphics/drawable/Drawable;)V

    .line 16
    iput p2, p0, Lcom/telerik/util/BackgroundColorTransition;->interval:I

    .line 17
    invoke-direct {p0}, Lcom/telerik/util/BackgroundColorTransition;->initVars()V

    .line 18
    return-void
.end method

.method private initVars()V
    .locals 2

    .prologue
    const/4 v1, 0x0

    const/4 v0, 0x1

    .line 20
    invoke-virtual {p0, v0}, Lcom/telerik/util/BackgroundColorTransition;->setCrossFadeEnabled(Z)V

    .line 21
    invoke-virtual {p0, v1, v1}, Lcom/telerik/util/BackgroundColorTransition;->setId(II)V

    .line 22
    invoke-virtual {p0, v0, v0}, Lcom/telerik/util/BackgroundColorTransition;->setId(II)V

    .line 23
    return-void
.end method


# virtual methods
.method public changeColor(I)V
    .locals 3
    .parameter "color"

    .prologue
    const/4 v2, 0x1

    .line 25
    const/4 v0, 0x0

    invoke-virtual {p0, v2}, Lcom/telerik/util/BackgroundColorTransition;->getDrawable(I)Landroid/graphics/drawable/Drawable;

    move-result-object v1

    invoke-virtual {p0, v0, v1}, Lcom/telerik/util/BackgroundColorTransition;->setDrawableByLayerId(ILandroid/graphics/drawable/Drawable;)Z

    .line 26
    new-instance v0, Landroid/graphics/drawable/ColorDrawable;

    invoke-direct {v0, p1}, Landroid/graphics/drawable/ColorDrawable;-><init>(I)V

    invoke-virtual {p0, v2, v0}, Lcom/telerik/util/BackgroundColorTransition;->setDrawableByLayerId(ILandroid/graphics/drawable/Drawable;)Z

    .line 27
    iget v0, p0, Lcom/telerik/util/BackgroundColorTransition;->interval:I

    invoke-virtual {p0, v0}, Lcom/telerik/util/BackgroundColorTransition;->startTransition(I)V

    .line 28
    return-void
.end method
